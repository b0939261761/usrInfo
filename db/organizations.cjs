const { sql } = require('slonik');
const connection = require('./db.cjs');

//-----------------------------

const whereFragmentGetOrganizations = ({
  status, year, month, day
} = {}) => {
  if (year && month && day && status) {
    return sql`WHERE EXTRACT(YEAR FROM "dateRegistration") = ${year}
      AND EXTRACT(MONTH FROM "dateRegistration") = ${month}
      AND EXTRACT(DAY FROM "dateRegistration") = ${day}
      AND "statusCRM" = ${status}`;
  }

  if (year && month && status) {
    return sql`WHERE EXTRACT(YEAR FROM "dateRegistration") = ${year}
      AND EXTRACT(MONTH FROM "dateRegistration") = ${month}
      AND "statusCRM" = ${status}`;
  }

  if (year && status) {
    return sql`WHERE EXTRACT(YEAR FROM "dateRegistration") = ${year}
      AND "statusCRM" = ${status}`;
  }

  if (status) {
    return sql`WHERE "statusCRM" = ${status}`;
  }

  if (year && month && day) {
    return sql`WHERE EXTRACT(YEAR FROM "dateRegistration") = ${year}
      AND EXTRACT(MONTH FROM "dateRegistration") = ${month}
      AND EXTRACT(DAY FROM "dateRegistration") = ${day}`;
  }

  if (year && month) {
    return sql`WHERE EXTRACT(YEAR FROM "dateRegistration") = ${year}
      AND EXTRACT(MONTH FROM "dateRegistration") = ${month}`;
  }

  if (year) {
    return sql`WHERE EXTRACT(YEAR FROM "dateRegistration") = ${year}`;
  }

  return sql``;
};

const sqlGetOrganizations = where => sql`
  SELECT * FROM "Organizations" ${whereFragmentGetOrganizations(where)} ORDER BY code;
`;

//-----------------------------

exports.getOrganizations = async options => (
  await connection.query(sqlGetOrganizations(options))
).rows;

//-----------------------------

exports.getOrganizationsStream = options => new Promise(
  resolve => connection.stream(sqlGetOrganizations(options), stream => resolve(stream))
);

//-----------------------------
