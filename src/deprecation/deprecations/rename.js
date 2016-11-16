import { get, isUndefined, isNull, set } from 'lodash';
import { unset } from '../../utils';

export default function (oldKey, newKey) {
  return (settings) => {
    const value = get(settings, oldKey);
    if (isUndefined(value)) {
      return;
    }

    unset(settings, oldKey);
    set(settings, newKey, value);
    return `Config key "${oldKey}" is deprecated. It has been replaced with "${newKey}"`;
  };
}
