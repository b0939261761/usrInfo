import request from '../utils/request.js';

const baseUrl = process.env.UFOP_BASE_URL;
const baseHeaders = { Token: process.env.UFOP_TOKEN };

//= ============================================================================

export const lastOrganization = () => request(`${baseUrl}organizations/last`, { headers: baseHeaders });

//= ============================================================================

export const isNewUsrInfoOrganization = code => request(
  `${baseUrl}organizations/isNewUsrInfo`, { method: 'POST', headers: baseHeaders, body: { code } }
);

//= ============================================================================

export const lastPerson = () => request(`${baseUrl}persons/last`, { headers: baseHeaders });

//= ============================================================================

export const isNewUsrInfoPerson = (fullName, address) => request(
  `${baseUrl}persons/isNewUsrInfo`,
  { method: 'POST', headers: baseHeaders, body: { fullName, address } }
);

//= ============================================================================

export default {
  lastOrganization,
  isNewUsrInfoOrganization,
  lastPerson,
  isNewUsrInfoPerson
};
