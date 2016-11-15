import { get, isUndefined, isNull } from 'lodash';
import unset from '../utils/unset';

export default function (oldKey) {
  return (settings) => {
    const value = get(settings, oldKey);
    if (isUndefined(value)) {
      return;
    }

    unset(settings, oldKey);
    return `${oldKey} is deprecated and is no longer used`;
  };
}
