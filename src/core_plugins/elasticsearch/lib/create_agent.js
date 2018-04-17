import url from 'url';
import { get } from 'lodash';
import http from 'http';
import https from 'https';

import { parseConfig } from './parse_config';

export default function (config) {
  const target = url.parse(get(config, 'url'));

  if (!/^https/.test(target.protocol)) return new http.Agent();

  const ssl = {
    ...parseConfig(config).ssl,
    certificate: null,
    key: null,
    passphrase: null,
    pfx: null,
  };


  return new https.Agent(ssl);
}
