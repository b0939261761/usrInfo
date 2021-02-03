import proxies from './proxies.cjs';
import organizations from './organizations.cjs';
import {
  notExistsOrganization,
  addOrganization,
  getStatusCRMNoneOrganization,
  setStatusCRMOrganization,
  checkingForDuplicateEmail,
  checkingForDuplicatePhone
} from './organizations.js';

import {
  notExistsPerson,
  addPerson,
  getStatusCRMNonePerson,
  setStatusCRMPerson
} from './persons.js';

export {
  notExistsOrganization,
  addOrganization,
  getStatusCRMNoneOrganization,
  setStatusCRMOrganization,
  checkingForDuplicateEmail,
  checkingForDuplicatePhone,
  notExistsPerson,
  addPerson,
  getStatusCRMNonePerson,
  setStatusCRMPerson
};

export default {
  ...organizations,
  notExistsOrganization,
  addOrganization,
  setStatusCRMOrganization,
  checkingForDuplicateEmail,
  checkingForDuplicatePhone,
  notExistsPerson,
  addPerson,
  getStatusCRMNonePerson,
  setStatusCRMPerson,
  ...proxies
};
