// eslint-disable-next-line import/no-unresolved, node/no-missing-import
import { setTimeout } from 'timers/promises';
import db from '../db/index.cjs';

export default class {
  async get() {
    this.id = null;
    const proxy = await db.getProxy();
    if (!proxy) throw new Error('NO_PROXY');
    console.info(proxy);
    const { id, username, password, lastActive } = proxy;
    const timeout = process.env.REPEAT_PROXY_TIMEOUT - Date.now() + lastActive;
    if (timeout > 0) await setTimeout(timeout);

    this.id = id;
    const protocol = proxy.protocol ? `${proxy.protocol}://` : '';
    const server = `${protocol}${proxy.server}`;
    return { server, username, password };
  }

  resetError() { return db.resetErrorProxy(this.id); }

  setError() { return db.setErrorProxy(this.id); }

  setLastActive() {
    if (this.id) return db.setLastActiveProxy(this.id);
    return true;
  }
}
