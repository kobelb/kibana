/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import crypto from 'crypto';
import { map } from 'rxjs/operators';
import { schema, TypeOf } from '@kbn/config-schema';
import { PluginInitializerContext } from 'src/core/server';

export const ConfigSchema = schema.object({
  enabled: schema.boolean({ defaultValue: true }),
  encryptionKey: schema.conditional(
    schema.contextRef('dist'),
    true,
    schema.maybe(schema.string({ minLength: 32 })),
    schema.string({ minLength: 32, defaultValue: 'a'.repeat(32) })
  ),
});

export function createConfig$(context: PluginInitializerContext) {
  return context.config.create<TypeOf<typeof ConfigSchema>>().pipe(
    map(config => {
      const logger = context.logger.get('config');

      let encryptionKey = config.encryptionKey;
      const encryptionKeyRandomlyGenerated = encryptionKey === undefined;
      if (encryptionKey === undefined) {
        logger.warn(
          'Generating a random key for xpack.encryptedSavedObjects.encryptionKey. ' +
            'To be able to decrypt encrypted saved objects attributes after restart, ' +
            'please set xpack.encryptedSavedObjects.encryptionKey in kibana.yml'
        );

        encryptionKey = crypto.randomBytes(16).toString('hex');
      }

      return {
        config: { ...config, encryptionKey },
        encryptionKeyRandomlyGenerated,
      };
    })
  );
}
