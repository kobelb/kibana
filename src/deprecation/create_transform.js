import { deepCloneWithBuffers as clone } from '../utils';
import { forEach, noop } from 'lodash';

export default function (deprecations) {
  return (settings, logger = noop) => {
    const result = clone(settings);

    forEach(deprecations, (deprecation) => {
      const error = deprecation(result);
      if (error) {
        logger(error);
      }
    });

    return result;
  };
}
