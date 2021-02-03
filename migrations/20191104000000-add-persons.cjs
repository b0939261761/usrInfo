const tableName = 'Persons';
const typeName = 'StatusCRM';

module.exports = {
  up: knex => knex.raw(`
    CREATE TABLE "${tableName}" (
      id SERIAL PRIMARY KEY,
      "statusCRM" "StatusCRM" NOT NULL DEFAULT 'none',
      phone1 VARCHAR(13) NOT NULL DEFAULT '',
      phone2 VARCHAR(13) NOT NULL DEFAULT '',
      email1 VARCHAR(254) NOT NULL DEFAULT '',
      email2 VARCHAR(254) NOT NULL DEFAULT '',
      "dateRegistration" DATE,
      "fullName" VARCHAR(254) NOT NULL DEFAULT ''::character varying,
      address VARCHAR(500) NOT NULL DEFAULT ''::character varying,
      activity VARCHAR(254) NOT NULL DEFAULT ''::character varying,
      status VARCHAR(100) NOT NULL DEFAULT ''::character varying,
      activities TEXT NOT NULL DEFAULT '',
      "dateAndRecordNumber" VARCHAR(120) NOT NULL DEFAULT '',
      contacts VARCHAR(500) NOT NULL DEFAULT '',
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE UNIQUE INDEX "${tableName}_fullName_address_idx" ON "${tableName}" ("fullName", address);

    COMMENT ON table "${tableName}" IS 'ФОП';
    COMMENT ON COLUMN "${tableName}".id IS 'Уникальный идентификатор';
    COMMENT ON COLUMN "${tableName}"."statusCRM" IS 'Статус записи CRM';
    COMMENT ON COLUMN "${tableName}".phone1 IS 'Телефон 1';
    COMMENT ON COLUMN "${tableName}".phone2 IS 'Телефон 2';
    COMMENT ON COLUMN "${tableName}".email1 IS 'Електронна пошта 1';
    COMMENT ON COLUMN "${tableName}".email2 IS 'Електронна пошта 2';
    COMMENT ON COLUMN "${tableName}"."dateRegistration" IS 'Дата реєстрації';
    COMMENT ON COLUMN "${tableName}"."fullName" IS 'Прізвище, ім"я, по батькові';
    COMMENT ON COLUMN "${tableName}".address IS 'Місцезнаходження';
    COMMENT ON COLUMN "${tableName}".activity IS 'Вид діяльності';
    COMMENT ON COLUMN "${tableName}".activities IS 'Види діяльності';
    COMMENT ON COLUMN "${tableName}"."dateAndRecordNumber" IS 'Дата та номер запису про проведення державної реєстрації';
    COMMENT ON COLUMN "${tableName}".contacts IS 'Інформація для здійснення зв"язку';
    COMMENT ON COLUMN "${tableName}".status IS 'Стан перебування';
    COMMENT ON COLUMN "${tableName}"."createdAt" IS 'Дата создания записи';
    COMMENT ON COLUMN "${tableName}"."updatedAt" IS 'Дата обновления записи';

    CREATE TRIGGER "${tableName}UpdateAt"
      BEFORE UPDATE ON "${tableName}"
        FOR EACH ROW EXECUTE PROCEDURE "updateAtTimestamp"();

    COMMENT ON TRIGGER "${tableName}UpdateAt" ON "${tableName}" IS 'Изменение даты обновления записи';
  `),
  down: knex => knex.raw(`
    DROP TABLE IF EXISTS "${tableName}";
    DROP TYPE IF EXISTS "${typeName}";
  `)
};
