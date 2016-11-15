import Config from './config';
import deprecations from './deprecations';
import { memoize, noop } from 'lodash';
import { transformDeprecations } from '../../deprecations';
import { red } from 'ansicolors';

const logger = memoize(function (message) {
  console.log(red('WARNING:'), message);
});

module.exports = function (kbnServer) {
  const settings = transformDeprecations(deprecations)(logger, kbnServer.settings);
  kbnServer.config = Config.withDefaultSchema(settings);
};
