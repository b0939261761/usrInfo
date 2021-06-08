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

import {
  getProxy,
  getProxies,
  removeProxies,
  setLastActiveProxy,
  addProxies
} from './proxies.js';

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
  setStatusCRMPerson,
  getProxy,
  getProxies,
  removeProxies,
  setLastActiveProxy,
  addProxies
};

export default {
  notExistsOrganization,
  addOrganization,
  setStatusCRMOrganization,
  checkingForDuplicateEmail,
  checkingForDuplicatePhone,
  notExistsPerson,
  addPerson,
  getStatusCRMNonePerson,
  setStatusCRMPerson,
  getProxy,
  getProxies,
  removeProxies,
  setLastActiveProxy,
  addProxies
};
