import express from 'express';
import proxies from './proxies.js';
import balance from './balance.js';

const routes = express.Router();
routes.use('/proxies', proxies);
routes.use('/balance', balance);

export default routes;
