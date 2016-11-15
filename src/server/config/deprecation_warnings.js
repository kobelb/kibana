import { transformDeprecations } from './deprecations';
import { memoize } from 'lodash';

export default function (kbnServer, server) {
  transformDeprecations(kbnServer.settings, memoize((message) => {
    server.log(['warning', 'config'], message);
  }));
}
