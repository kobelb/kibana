import Config from './config';
import { transformDeprecations } from './deprecations';

module.exports = function (kbnServer) {
  const settings = transformDeprecations(kbnServer.settings);
  kbnServer.config = Config.withDefaultSchema(settings);
};
