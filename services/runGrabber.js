/* eslint-disable no-continue */
// eslint-disable-next-line import/no-unresolved, node/no-missing-import
import { setTimeout } from 'timers/promises';
import { getCaptchaBalance } from './captchaRequest.js';
import grabber from './grabber.js';
import ProxyItem from './proxyItem.js';
import sendMarketing from './sendMarketing.js';
import AmoCRM from './amoCRM.js';
import { formatDate } from '../utils/date.js';
import {
  getLastUfop, checkUfop, isNewUsrInfoUfop, insertDBUfop,
  getStatusCRMNoneUfop, setStatusCRMUfop
} from './ufop.js';

const MIN_BALANCE = 1;
const amoCRM = new AmoCRM();

// ------------------------

const sendContacts = async () => {
  for (const item of await getStatusCRMNoneUfop()) {
    const validationDateRegistration = value => (
      (new Date(new Date().toISOString().slice(0, 10)) - new Date(value)) / 86_400_000 < 31
    );

    const statusCRM = item.phone1 && validationDateRegistration(item.dateRegistration) ? 'send' : 'unsuitable';
    if (statusCRM === 'send') await amoCRM.send(item);
    await setStatusCRMUfop({ id: item.id, statusCRM, isOrganization: item.isOrganization });
  }
};

(async () => {
  const proxyItem = new ProxyItem();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const ufopItem = await getLastUfop();

      if (!ufopItem) {
        console.info('NO UFOP');
        await setTimeout(process.env.STOP_GRABBER_TIMEOUT);
        continue;
      }

      const message = ufopItem.isOrganization
        ? `CODE: ${ufopItem.code}`
        : `FULLNAME: ${ufopItem.fullName}`;
      console.info(message);

      if (!(await checkUfop(ufopItem))) {
        await isNewUsrInfoUfop(ufopItem);
        continue;
      }

      if ((await getCaptchaBalance()) < MIN_BALANCE) throw new Error('CAPTCHA_NO_BALANCE');

      const proxy = await proxyItem.get();
      const ufopItemParse = await grabber({ ufopItem, proxy });
      const ufopItemDB = await insertDBUfop(ufopItemParse);
      await isNewUsrInfoUfop(ufopItem);
      await sendMarketing(ufopItemDB);
      await sendContacts();
    } catch (err) {
      const errMessage = err.message;

      const isInvalidProxy = errMessage.startsWith('INVALID_PROXY');
      const isCaptchaUnsolvable = errMessage === 'ERROR_CAPTCHA_UNSOLVABLE';
      const isStructureError = errMessage.includes('STRUCTURE_ERROR');

      let consoleMessage = err;
      if (isInvalidProxy || isCaptchaUnsolvable) consoleMessage = errMessage;
      else if (isStructureError) consoleMessage = 'STRUCTURE_ERROR';

      console.error(formatDate('YYYY-MM-DD HH:mm:ss'), consoleMessage);
      if (isStructureError) return;
      await setTimeout(process.env.ERROR_TIMEOUT);
    } finally {
      await proxyItem.setLastActive();
    }
  }
})();
