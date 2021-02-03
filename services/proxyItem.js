// eslint-disable-next-line import/no-unresolved, node/no-missing-import
import { setTimeout } from 'timers/promises';
import { getProxy, setLastActiveProxy } from '../db/index.js';

export default class {
  async get() {
    this.id = null;
    const proxy = await getProxy();
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

  setLastActive() {
    if (this.id) return setLastActiveProxy(this.id);
    return true;
  }
}
