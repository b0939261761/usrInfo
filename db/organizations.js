import slonik from 'slonik';
import connection from './db.cjs';
import { parseOrganization } from '../organization/parse.js';

//= ============================================================================

export const notExistsOrganization = async code => (await connection.one(slonik.sql`
  SELECT NOT EXISTS(SELECT 1 FROM "Organizations" WHERE code = ${code}) AS "notExists"
`)).notExists;

//= ============================================================================

export const getStatusCRMNoneOrganization = async () => (await connection.query(slonik.sql`
  SELECT *

  FROM "Organizations" WHERE "statusCRM" = 'none' ORDER BY "createdAt";
`)).rows;

//= ============================================================================

export const setStatusCRMOrganization = ({ id, statusCRM }) => connection.query(slonik.sql`
  UPDATE "Organizations" SET "statusCRM" = ${statusCRM} WHERE id = ${id};
`);

//= ============================================================================

export const checkingForDuplicateEmail = async email => (await connection.one(slonik.sql`
  SELECT COUNT(*) < 2 AS "notExists" FROM (
    SELECT 1 FROM "Persons" WHERE email1 = ${email} OR email2 = ${email}
    UNION ALL
    SELECT 1 FROM "Organizations" WHERE email1 = ${email} OR email2 = ${email}
  ) t
`)).notExists;

//= ============================================================================

export const checkingForDuplicatePhone = async phone => (await connection.one(slonik.sql`
  SELECT COUNT(*) < 2 AS "notExists" FROM (
    SELECT 1 FROM "Persons" WHERE phone1 = ${phone} OR phone2 = ${phone}
    UNION ALL
    SELECT 1 FROM "Organizations" WHERE phone1 = ${phone} OR phone2 = ${phone}
  ) t
`)).notExists;

//= ============================================================================

export const addOrganization = data => {
  const {
    code = '',
    fullName = '',
    name = '',
    manager = '',
    address = '',
    status = '',
    activity = '',
    legalForm = '',
    founders = '',
    dataAuthorizedCapital = '',
    activities = '',
    persons = '',
    dateAndRecordNumber = '',
    contacts = '',
    statusCRM = 'none'
  } = data;

  const {
    phone1, phone2, email1, email2, dateRegistration, capital
  } = parseOrganization({ contacts, dateAndRecordNumber, dataAuthorizedCapital });

  return connection.one(slonik.sql`
    INSERT INTO "Organizations" (
      code, "fullName", name, manager, address, status, activity,
      "legalForm", founders, "dataAuthorizedCapital", activities,
      persons, "dateAndRecordNumber", contacts, "statusCRM",
      phone1, phone2, email1, email2, "dateRegistration", capital
    ) VALUES (
      ${code}, ${fullName}, ${name}, ${manager}, ${address}, ${status}, ${activity},
      ${legalForm}, ${founders}, ${dataAuthorizedCapital}, ${activities},
      ${persons}, ${dateAndRecordNumber}, ${contacts}, ${statusCRM},
      ${phone1}, ${phone2}, ${email1}, ${email2}, ${dateRegistration}, ${capital}
    )
      RETURNING *
  `);
};

//= ============================================================================

export default {
  notExistsOrganization,
  setStatusCRMOrganization,
  checkingForDuplicateEmail,
  checkingForDuplicatePhone,
  addOrganization
};
