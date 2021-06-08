const wrongActivities = [
  '01', '02', '03', '05', '06', '07', '08', '09', '64', '65', '66', '69.20', '84'
];

const validAddressPersons = [
  'Київська обл.', 'місто Київ',
  'Тернопільська обл.', 'Львівська обл.',
  'Харківська обл.', 'Полтавська обл.'
];

const validAddressOrganization = [
  'Київська обл.', 'місто Київ',
  'Тернопільська обл.', 'Львівська обл.',
  'Харківська обл.', 'Полтавська обл.',
  'Одеська обл.'
];

const validationStatus = value => value === 'зареєстровано';
const validationAddressPerson = value => validAddressPersons.some(el => value.includes(el));
const validationAddressOrganization = value => validAddressOrganization
  .some(el => value.includes(el));

const validationActivity = value => !wrongActivities.some(el => value.startsWith(el));

const validationUfop = data => validationStatus(data.status)
  && validationActivity(data.activity);

export const validationUfopOrganization = data => data.code.length === 8
  && data.code > '43000000'
  && validationUfop(data)
  && validationAddressOrganization(data.address);

export const validationUfopPerson = data => data.fullName
  && validationUfop(data)
  && validationAddressPerson(data.address);

export default {
  validationUfopOrganization,
  validationUfopPerson
};
