// # Raksha Nataliia
// AMOCRM_RESPONSIBLE_USER_ID1=3632872

import dotenv from 'dotenv';
import AmoCRM from '../services/amoCRM.js';

dotenv.config();
// const { sql } = require('slonik');
// const connection = require('./db/db');
// const parse = require('./organization/parse');

const item = {
  code: '00000000',
  fullName: 'ТОВ ТЕСТ',
  activitiy: '80.10 Діяльність приватних охоронних служб',
  manager: 'Остап Бендер',
  address: 'Україна, 01601, місто Київ, вул.Мечнікова, будинок 2, ЛІТ. А',
  phone1: '+380961647915',
  phone2: '+380961647916',
  email1: '37642980@ukr.net',
  dateRegistration: '2021-06-10',
  capital: 1000,
  isOrganization: true
};

// console.log(111);

const amoCRM = new AmoCRM();
amoCRM.send(item);
