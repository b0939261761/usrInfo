import http from 'http';
import https from 'https';

export default async (url, options = {}) => {
  let resolve;
  let reject;

  const urlObj = new URL(url);
  const isHttps = urlObj.protocol === 'https:';
  const lib = isHttps ? https : http;

  let path = urlObj.pathname;
  if (options.params) {
    const params = new URLSearchParams();
    Object.entries(options.params).forEach(([key, value]) => params.append(key, value));
    path += `?${params}`;
  }

  let body;
  let headers;

  if (options.body && typeof options.body === 'object') {
    body = JSON.stringify(options.body);
    headers = { 'Content-Type': 'application/json' };
  }

  if (options.headers) headers = { ...headers, ...options.headers };

  const params = {
    method: options.method || 'GET',
    protocol: urlObj.protocol,
    hostname: urlObj.hostname,
    port: urlObj.port,
    path,
    timeout: options.timeout ?? 0,
    headers
  };

  const onRequest = async res => {
    const { statusCode } = res;
    if (statusCode < 200 || statusCode >= 300) return reject(new Error(`HTTP: ${statusCode}`));

    if (options.responseType === 'stream') return resolve(res);

    const data = [];
    try {
      for await (const chunk of res) data.push(chunk);
    } catch (err) {
      return reject(err);
    }

    const body = Buffer.concat(data).toString();
    if (body && res.headers['content-type'] === 'application/json') return resolve(JSON.parse(body));
    return resolve(body);
  };

  const request = (res, rej) => {
    ([resolve, reject] = [res, rej]);
    const req = lib.request(params, onRequest);

    if (body) req.write(body);

    req
      .on('error', error => !req.aborted && reject(error))
      .on('timeout', () => req.abort())
      .end();
  };

  return new Promise(request);
};
