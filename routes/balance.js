import express from 'express';
import { catchAsyncRoute } from '../utils/tools.js';
import { getCaptchaBalance } from '../services/captchaRequest.js';

const routes = express.Router();

routes.get('', catchAsyncRoute(async (req, res) => res.send(await getCaptchaBalance())));

export default routes;
