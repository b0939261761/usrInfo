import { chromium, errors } from 'playwright';
// eslint-disable-next-line import/no-unresolved, node/no-missing-import
import { setTimeout } from 'timers/promises';
import { setCaptchaToken, getCaptchaToken } from './captchaRequest.js';

const getCaptcha = async key => {
  const id = await setCaptchaToken(key);
  if (!id) throw new Error('CAPTCHA_NO_ID');

  const maxTimestamp = Date.now() + process.env.GET_CAPTCHA_TOKEN_MAX_TIMEOUT;
  await setTimeout(process.env.GET_CAPTCHA_TOKEN_FIRST_TIMEOUT);
  do {
    const token = await getCaptchaToken(id);
    if (token) return token;
    await setTimeout(process.env.GET_CAPTCHA_TOKEN_NEXT_TIMEOUT);
  } while (Date.now() < maxTimestamp);

  throw new Error(`CAPTCHA_NO_TOKEN - ${id}`);
};

const getValuesPerson = el => {
  if (el.querySelectorAll('tr').length !== 12) throw new Error('STRUCTURE_ERROR');

  return {
    activities: el.rows[2].cells[1].textContent.trim(),
    dateAndRecordNumber: el.rows[4].cells[1].textContent.trim(),
    contacts: el.rows[11].cells[1].textContent.trim()
  };
};

const getValuesOrganization = el => {
  const rowCount = el.querySelectorAll('tr').length;
  if (rowCount === 30) {
    return {
      legalForm: el.rows[1].cells[1].textContent.trim(),
      name: el.rows[2].cells[1].textContent.trim(),
      dataAuthorizedCapital: el.rows[7].cells[1].textContent.trim(),
      founders: el.rows[8].cells[1].textContent.trim(),
      activities: el.rows[10].cells[1].textContent.trim(),
      persons: el.rows[12].cells[1].textContent.trim(),
      dateAndRecordNumber: el.rows[14].cells[1].textContent.trim(),
      contacts: el.rows[29].cells[1].textContent.trim()
    };
  } if (rowCount === 18) {
    return {
      legalForm: el.rows[1].cells[1].textContent.trim(),
      name: el.rows[2].cells[1].textContent.trim(),
      dateAndRecordNumber: el.rows[7].cells[1].textContent.trim(),
      persons: el.rows[10].cells[1].textContent.trim()
    };
  } if (rowCount === 17) {
    return {
      legalForm: el.rows[1].cells[1].textContent.trim(),
      name: el.rows[2].cells[1].textContent.trim(),
      dateAndRecordNumber: el.rows[6].cells[1].textContent.trim(),
      persons: el.rows[9].cells[1].textContent.trim()
    };
  }
  throw new Error('STRUCTURE_ERROR');
};

export default async ({ ufopItem, proxy }) => {
  const options = {
    headless: process.env.NODE_ENV === 'production',
    chromiumSandbox: false,
    proxy
  };

  const browser = await chromium.launch(options);
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    page.setDefaultTimeout(+process.env.NAVIGATION_TIMEOUT);
    await page.goto(process.env.SITE_URL);

    // Выбор кода
    await page.click(`app-radio-buttons input[value="${ufopItem.isOrganization ? 2 : 1}"]`);
    await page.focus('app-input-field input:enabled');
    await page.keyboard.type(ufopItem.isOrganization ? ufopItem.code : ufopItem.fullName);
    await page.click('button[type="submit"]');

    // Отправка captcha
    const frame = await page.waitForSelector('re-captcha iframe');
    const recatchaSrc = await frame.evaluate(el => el.src);
    const captchaKey = new URL(recatchaSrc).searchParams.get('k');
    const captchaToken = await getCaptcha(captchaKey);

    await page.evaluate(token => {
      // https://rucaptcha.com/api-rucaptcha#callback
      // https://gist.github.com/2captcha/2ee70fa1130e756e1693a5d4be4d8c70
      // eslint-disable-next-line no-underscore-dangle
      const cfg = globalThis.___grecaptcha_cfg;
      for (const client of Object.values(cfg.clients)) {
        for (const [key0, value0] of Object.entries(client)) {
          for (const [key1, value1] of Object.entries(value0)) {
            if (value1?.sitekey) {
              cfg.clients[client.id][key0][key1].callback(token);
              return;
            }
          }
        }
      }
    }, captchaToken);

    await page.waitForTimeout(1000);
    await page.click('recaptcha-wrapper button');

    const selector = await Promise.race([
      page.waitForSelector('.table-wrapper tr'),
      page.waitForSelector('search-result-table .text-danger')
    ]);

    if (await selector.evaluate(el => el.tagName === 'P')) {
      const textErrorValue = await selector.textContent();
      if (textErrorValue.includes('знайдено')) return { ...ufopItem, statusCRM: 'not found' };
      throw new Error('INVALID_PROXY_TRY_LATER');
    }

    const rows = await page.$$('.table-wrapper tr');
    let rowNumber = -1;
    if (rows.length === 1) {
      rowNumber = 0;
    } else {
      for (let i = 0; i < rows.length; ++i) {
        if (ufopItem.isOrganization) {
          const [cellFullName, cellCode, cellAddress, cellStatus] = await rows[i].evaluate(
            el => [
              el.cells[0].textContent.trim().replaceAll('’', '\''),
              el.cells[1].textContent.trim(),
              el.cells[2].textContent.trim(),
              el.cells[3].textContent.trim()
            ]
          );

          if (ufopItem.fullName === cellFullName && ufopItem.code === cellCode
          && ufopItem.address === cellAddress && ufopItem.status === cellStatus) {
            rowNumber = i;
            break;
          }
        } else {
          const [cellFullName, cellAddress, cellStatus] = await rows[i].evaluate(
            el => [
              el.cells[0].textContent.toUpperCase().trim(),
              el.cells[1].textContent.trim(),
              el.cells[2].textContent.trim()
            ]
          );

          if (ufopItem.fullName === cellFullName && ufopItem.address === cellAddress
          && ufopItem.status === cellStatus) {
            rowNumber = i;
            break;
          }
        }
      }
    }

    let values = {};
    if (rowNumber === -1) {
      values.statusCRM = 'not found';
    } else {
      const buttonGo = await rows[rowNumber].$('button');
      await buttonGo.click();

      await page.waitForSelector('app-table .table-wrapper tr:nth-child(2)');
      const getValues = ufopItem.isOrganization ? getValuesOrganization : getValuesPerson;
      values = await page.$eval('.table-wrapper table', getValues);
      if (ufopItem.name) values.name = ufopItem.name;
    }
    return { ...ufopItem, ...values };
  } catch (err) {
    if (err instanceof errors.TimeoutError) throw new Error('INVALID_PROXY_TIMEOUT');
    throw err;
  } finally {
    await browser.close();
  }
};
