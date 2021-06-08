const getPhone = value => (value?.[1].replace(/\)|\(|-|,/g, '') || '').substring(0, 13);

//= ============================================================================

const getPhones = value => {
  const phones = [...value.matchAll(/(?:Телефон .: )(\S+)(?: |$)/g)];
  let phone1 = getPhone(phones[0]);
  let phone2 = getPhone(phones[1]);

  if (!phone1 && phone2) [phone1, phone2] = [phone2, ''];
  if (phone1 === phone2) phone2 = '';
  return { phone1, phone2 };
};

//= ============================================================================

const validEmail = email => {
  // eslint-disable-next-line no-useless-escape
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

//= ============================================================================

const getEmail = value => (validEmail(value?.[1]) ? value[1].toLowerCase() : '');

//= ============================================================================

const getEmails = value => {
  let email1 = getEmail(value.match(/(?:Адреса електронної пошти: )(\S+)(?: |$)/) || []);
  let email2 = getEmail(value.match(/(?:Веб сторінка: )(\S+)(?: |$)/) || []);

  if (!email1 && email2) [email1, email2] = [email2, ''];
  if (email1 === email2) email2 = '';
  return { email1, email2 };
};

//= ============================================================================

const parseContacts = value => ({ ...getPhones(value), ...getEmails(value) });

//= ============================================================================

const parseDateRegistration = value => {
  const match = value.match(/(?<day>\d{2})\.(?<month>\d{2})\.(?<year>\d{4})/);
  return match && `${match.groups.year}-${match.groups.month}-${match.groups.day}`;
};
//= ============================================================================

const parseCapital = value => +value.match(/(?:Розмір.*?)(\d+)/)?.[1] || 0;

//= ============================================================================

export const parsePerson = ({ contacts, dateAndRecordNumber }) => ({
  ...parseContacts(contacts),
  dateRegistration: parseDateRegistration(dateAndRecordNumber)
});

//= ============================================================================

export const parseOrganization = ({ contacts, dateAndRecordNumber, dataAuthorizedCapital }) => ({
  ...parsePerson({ contacts, dateAndRecordNumber }),
  capital: parseCapital(dataAuthorizedCapital)
});

//= ============================================================================

export default {
  parsePerson,
  parseOrganization
};
