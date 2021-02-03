import slonik from 'slonik';
import connection from './db.cjs';

//= ============================================================================

export const getProxy = () => connection.maybeOne(slonik.sql`
  SELECT id, server, protocol, username, password, "lastActive" FROM "Proxies"
  ORDER BY "lastActive" NULLS FIRST, id
  LIMIT 1;
`);

//= ============================================================================

export const getProxies = async () => (await connection.query(slonik.sql`
  SELECT id, server, protocol, username, password, "lastActive" FROM "Proxies"
  ORDER BY "lastActive" NULLS FIRST, id
`)).rows;

//= ============================================================================

export const removeProxies = () => connection.query(slonik.sql`DELETE FROM "Proxies"`);

//= ============================================================================

export const setLastActiveProxy = id => connection.query(slonik.sql`
  UPDATE "Proxies" SET "lastActive" = TO_TIMESTAMP(${Date.now() / 1000}) WHERE id = ${id};
`);

//= ============================================================================

export const addProxies = proxies => {
  const values = slonik.sql.unnest(
    [...proxies.map(el => [el.server, el.protocol, el.username, el.password])],
    ['text', 'text', 'text', 'text']
  );

  return connection.query(slonik.sql`
    INSERT INTO "Proxies" (server, protocol, username, password)
      SELECT server, protocol, username, password FROM
        ${values} AS tmp(server, protocol, username, password)
      ON CONFLICT (server) DO UPDATE SET
        protocol = EXCLUDED.protocol,
        username = EXCLUDED.username,
        password = EXCLUDED.password;
  `);
};

export default {
  getProxy,
  getProxies,
  removeProxies,
  setLastActiveProxy,
  addProxies
};
