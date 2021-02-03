import slonik from 'slonik';
import { parsePerson } from '../organization/parse.js';
import connection from './db.cjs';

//= ============================================================================

export const notExistsPerson = async (fullName, address) => (
  await connection.one(slonik.sql`
    SELECT NOT EXISTS(
      SELECT 1 FROM "Persons"
      WHERE "fullName" = ${fullName} AND address = ${address}
    ) AS "notExists"
  `)
).notExists;

//= ============================================================================

export const addPerson = data => {
  const {
    fullName = '',
    address = '',
    activity = '',
    status = '',
    activities = '',
    contacts = '',
    dateAndRecordNumber = '',
    statusCRM = 'none'
  } = data;

  const {
    phone1, phone2, email1, email2, dateRegistration
  } = parsePerson({ contacts, dateAndRecordNumber });

  return connection.one(slonik.sql`
    INSERT INTO "Persons" (
      "fullName", address, activity, status, activities,
      contacts, "dateAndRecordNumber", "statusCRM",
      phone1, phone2, email1, email2, "dateRegistration"
    ) VALUES (
      ${fullName}, ${address}, ${activity}, ${status}, ${activities},
      ${contacts}, ${dateAndRecordNumber}, ${statusCRM},
      ${phone1}, ${phone2}, ${email1}, ${email2}, ${dateRegistration}
    )
    RETURNING *;
  `);
};

//= ============================================================================

export const getStatusCRMNonePerson = async () => (await connection.query(slonik.sql`
  SELECT * FROM "Persons" WHERE "statusCRM" = 'none' ORDER BY "createdAt";
`)).rows;

//= ============================================================================

export const setStatusCRMPerson = ({ id, statusCRM }) => connection.query(slonik.sql`
  UPDATE "Persons" SET "statusCRM" = ${statusCRM} WHERE id = ${id};
`);

//= ============================================================================

export default {
  notExistsPerson,
  addPerson,
  getStatusCRMNonePerson,
  setStatusCRMPerson
};
