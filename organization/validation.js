const wrongActivities = [
  '01', '02', '03', '05', '06', '07', '08', '09', '64', '65', '66', '69.20', '84'
];

const validAddress = [
  'Київська обл.', 'місто Київ',
  'Тернопільська обл.', 'Львівська обл.',
  'Харківська обл.', 'Полтавська обл.'
];

const validationStatus = value => value === 'зареєстровано';
const validationAddress = value => validAddress.some(el => value.includes(el));
const validationActivity = value => !wrongActivities.some(el => value.startsWith(el));

const validationUfop = data => validationStatus(data.status)
  && validationAddress(data.address)
  && validationActivity(data.activity);

export const validationUfopOrganization = data => data.code.length === 8
  && data.code > '43000000'
  && validationUfop(data);

export const validationUfopPerson = data => data.fullName && validationUfop(data);

export const validationParse = org => validationUfop(org);

export default {
  validationUfopOrganization,
  validationUfopPerson
};
