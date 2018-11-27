/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { functionsRegistry } from '@kbn/interpreter/common';
import { populateServerRegistries } from '@kbn/interpreter/server';
import { routes } from './server/routes';
import { commonFunctions } from './common/functions';
import { registerCanvasUsageCollector } from './server/usage';
import { loadSampleData } from './server/sample_data';

export default async function(server /*options*/) {
  server.injectUiAppVars('canvas', () => {
    const config = server.config();
    const basePath = config.get('server.basePath');
    const reportingBrowserType = config.get('xpack.reporting.capture.browser.type');

    return {
      kbnIndex: config.get('kibana.index'),
      esShardTimeout: config.get('elasticsearch.shardTimeout'),
      esApiVersion: config.get('elasticsearch.apiVersion'),
      serverFunctions: functionsRegistry.toArray(),
      basePath,
      reportingBrowserType,
    };
  });

  server.plugins.xpack_main.registerFeature({
    id: 'canvas',
    name: 'Canvas',
    icon: 'canvasApp',
    navLinkId: 'canvas',
    privileges: {
      kibana: {
        all: {
          app: ['canvas'],
          savedObject: {
            all: ['canvas'],
            read: ['config', 'index-pattern'],
          },
          ui: {
            navLink: true,
          },
        },
        read: {
          app: ['canvas'],
          savedObject: {
            all: [],
            read: ['config', 'index-pattern', 'canvas'],
          },
          ui: {
            navLink: true,
          },
        },
      },
    },
  });

  // There are some common functions that use private APIs, load them here
  commonFunctions.forEach(func => functionsRegistry.register(func));

  registerCanvasUsageCollector(server);
  loadSampleData(server);

  // Do not initialize the app until the registries are populated
  await populateServerRegistries(['serverFunctions', 'types']);
  routes(server);
}
