import express from 'express';
import proxies from './proxies.cjs';
import organizations from './organizations.cjs';
import balance from './balance.js';

const routes = express.Router();

routes.get('', (req, res) => res.end('UsrInfo'));
routes.use('/proxies', proxies);
routes.use('/organizations', organizations);
routes.use('/balance', balance);

export default routes;
