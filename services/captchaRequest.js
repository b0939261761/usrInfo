import request from '../utils/request.js';

const baseUrl = 'http://rucaptcha.com/';
const baseParams = { key: process.env.RUCAPTCHA_KEY, json: 1 };

//= ============================================================================

export const getCaptchaBalance = async () => {
  const params = { action: 'getbalance' };
  const response = await request(`${baseUrl}res.php`, { params: { ...baseParams, ...params } });
  if (response.status) return response.request;
  throw new Error(`CAPTCHA_${response.request}\n${response.error_text}`);
};

//= ============================================================================

export const setCaptchaToken = async googlekey => {
  const params = {
    method: 'userrecaptcha',
    googlekey,
    pageurl: process.env.SITE_URL
  };
  const response = await request(`${baseUrl}in.php`, { params: { ...baseParams, ...params } });
  if (response.status) return response.request;
  throw new Error(`CAPTCHA_${response.request}\n${response.error_text}`);
};

//= ============================================================================

export const getCaptchaToken = async id => {
  const params = { action: 'get', id };
  const response = await request(`${baseUrl}res.php`, { params: { ...baseParams, ...params } });
  if (response.status) return response.request;
  if (response.request === 'CAPCHA_NOT_READY') return false;
  throw new Error(`CAPTCHA_${response.request}\n${response.error_text}`);
};

//= ============================================================================

export default {
  getCaptchaBalance,
  setCaptchaToken,
  getCaptchaToken
};
