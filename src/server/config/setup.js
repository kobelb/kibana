import Config from './config';
import deprecations from './deprecations';
import { transformDeprecations } from '../../deprecations';

module.exports = function (kbnServer) {
  const settings = transformDeprecations(deprecations)(kbnServer.settings);
  kbnServer.config = Config.withDefaultSchema(settings);
};
