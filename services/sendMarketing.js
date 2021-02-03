import sendMail from './sendMail.js';
import sendSMS from './sendSMS.js';
import { checkingForDuplicateEmail, checkingForDuplicatePhone } from '../db/index.js';

const checkPhoneOperator = phone => ['67', '68', '96', '97', '98', '50', '66', '95',
  '99', '63', '73', '93', '91', '92', '94'].includes(phone.slice(4, 6));

export default async ({ phone1, email1, email2 }) => {
  if (checkPhoneOperator(phone1) && await checkingForDuplicatePhone(phone1)) await sendSMS(phone1);
  if (await checkingForDuplicateEmail(email1)) await sendMail(email1);
  if (await checkingForDuplicateEmail(email2)) await sendMail(email2);
};
