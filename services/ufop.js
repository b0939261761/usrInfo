import {
  lastOrganization, isNewUsrInfoOrganization, lastPerson, isNewUsrInfoPerson
} from './ufopRequest.js';
import {
  notExistsOrganization, addOrganization, getStatusCRMNoneOrganization, setStatusCRMOrganization,
  notExistsPerson, addPerson, getStatusCRMNonePerson, setStatusCRMPerson
} from '../db/index.js';
import { validationUfopOrganization, validationUfopPerson } from '../organization/validation.js';

//= ============================================================================

export const getLastUfop = async () => {
  const data = await lastOrganization();
  if (data) {
    data.isOrganization = true;
    return data;
  }
  return lastPerson();
};

//= ============================================================================

export const checkUfop = async data => (data.isOrganization
  ? validationUfopOrganization(data) && notExistsOrganization(data.code)
  : validationUfopPerson(data)
    && notExistsPerson(data.fullName, data.address)
);

//= ============================================================================

export const isNewUsrInfoUfop = data => (data.isOrganization
  ? isNewUsrInfoOrganization(data.code)
  : isNewUsrInfoPerson(data.fullName, data.address)
);

//= ============================================================================

export const insertDBUfop = data => (
  data.isOrganization ? addOrganization(data) : addPerson(data)
);

//= ============================================================================

export const getStatusCRMNoneUfop = async () => {
  const orgs = await getStatusCRMNoneOrganization();
  orgs.forEach(el => (el.isOrganization = true));
  const persons = await getStatusCRMNonePerson();
  return [...orgs, ...persons];
};

//= ============================================================================

export const setStatusCRMUfop = data => (data.isOrganization
  ? setStatusCRMOrganization(data)
  : setStatusCRMPerson(data)
);

//= ============================================================================

export default {
  getLastUfop,
  checkUfop,
  isNewUsrInfoUfop,
  insertDBUfop,
  getStatusCRMNoneUfop,
  setStatusCRMUfop
};
