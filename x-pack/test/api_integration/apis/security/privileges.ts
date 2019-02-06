/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { KibanaFunctionalTestDefaultProviders } from 'x-pack/test/types/providers';

// tslint:disable no-default-export
export default function({ getService }: KibanaFunctionalTestDefaultProviders) {
  const supertest = getService('supertest');

  let version: string;

  describe('Privileges', () => {
    before(async () => {
      const versionService = getService('kibanaServer').version;
      version = await versionService.get();
    });

    // This test also functions as a sanity check for assigned privilege actions, to ensure that feature privileges are being granted in the way that developers expect.

    describe('GET /api/security/privileges?includeActions=true', () => {
      it('should return a privilege map with all known privileges with actions', async () => {
        await supertest
          .get('/api/security/privileges?includeActions=true')
          .set('kbn-xsrf', 'xxx')
          .send()
          .expect(200, {
            features: {
              discover: {
                all: [
                  'login:',
                  `version:${version}`,
                  'app:kibana',
                  'saved_object:search/bulk_get',
                  'saved_object:search/get',
                  'saved_object:search/find',
                  'saved_object:search/create',
                  'saved_object:search/bulk_create',
                  'saved_object:search/update',
                  'saved_object:search/delete',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'saved_object:index-pattern/bulk_get',
                  'saved_object:index-pattern/get',
                  'saved_object:index-pattern/find',
                  'ui:discover/show',
                  'ui:discover/save',
                  'ui:navLinks/kibana:discover',
                  'ui:catalogue/discover',
                ],
                read: [
                  'login:',
                  `version:${version}`,
                  'app:kibana',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'saved_object:index-pattern/bulk_get',
                  'saved_object:index-pattern/get',
                  'saved_object:index-pattern/find',
                  'saved_object:search/bulk_get',
                  'saved_object:search/get',
                  'saved_object:search/find',
                  'ui:discover/show',
                  'ui:navLinks/kibana:discover',
                  'ui:catalogue/discover',
                ],
              },
              visualize: {
                all: [
                  'login:',
                  `version:${version}`,
                  'app:kibana',
                  'saved_object:visualization/bulk_get',
                  'saved_object:visualization/get',
                  'saved_object:visualization/find',
                  'saved_object:visualization/create',
                  'saved_object:visualization/bulk_create',
                  'saved_object:visualization/update',
                  'saved_object:visualization/delete',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'saved_object:index-pattern/bulk_get',
                  'saved_object:index-pattern/get',
                  'saved_object:index-pattern/find',
                  'saved_object:search/bulk_get',
                  'saved_object:search/get',
                  'saved_object:search/find',
                  'ui:navLinks/kibana:visualize',
                  'ui:catalogue/visualize',
                ],
                read: [
                  'login:',
                  `version:${version}`,
                  'app:kibana',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'saved_object:index-pattern/bulk_get',
                  'saved_object:index-pattern/get',
                  'saved_object:index-pattern/find',
                  'saved_object:search/bulk_get',
                  'saved_object:search/get',
                  'saved_object:search/find',
                  'saved_object:visualization/bulk_get',
                  'saved_object:visualization/get',
                  'saved_object:visualization/find',
                  'ui:navLinks/kibana:visualize',
                  'ui:catalogue/visualize',
                ],
              },
              dashboard: {
                all: [
                  'login:',
                  `version:${version}`,
                  'app:kibana',
                  'saved_object:dashboard/bulk_get',
                  'saved_object:dashboard/get',
                  'saved_object:dashboard/find',
                  'saved_object:dashboard/create',
                  'saved_object:dashboard/bulk_create',
                  'saved_object:dashboard/update',
                  'saved_object:dashboard/delete',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'saved_object:index-pattern/bulk_get',
                  'saved_object:index-pattern/get',
                  'saved_object:index-pattern/find',
                  'saved_object:search/bulk_get',
                  'saved_object:search/get',
                  'saved_object:search/find',
                  'saved_object:visualization/bulk_get',
                  'saved_object:visualization/get',
                  'saved_object:visualization/find',
                  'saved_object:timelion-sheet/bulk_get',
                  'saved_object:timelion-sheet/get',
                  'saved_object:timelion-sheet/find',
                  'saved_object:canvas-workpad/bulk_get',
                  'saved_object:canvas-workpad/get',
                  'saved_object:canvas-workpad/find',
                  'ui:dashboard/createNew',
                  'ui:dashboard/show',
                  'ui:dashboard/showWriteControls',
                  'ui:navLinks/kibana:dashboard',
                  'ui:catalogue/dashboard',
                ],
                read: [
                  'login:',
                  `version:${version}`,
                  'app:kibana',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'saved_object:index-pattern/bulk_get',
                  'saved_object:index-pattern/get',
                  'saved_object:index-pattern/find',
                  'saved_object:search/bulk_get',
                  'saved_object:search/get',
                  'saved_object:search/find',
                  'saved_object:visualization/bulk_get',
                  'saved_object:visualization/get',
                  'saved_object:visualization/find',
                  'saved_object:timelion-sheet/bulk_get',
                  'saved_object:timelion-sheet/get',
                  'saved_object:timelion-sheet/find',
                  'saved_object:canvas-workpad/bulk_get',
                  'saved_object:canvas-workpad/get',
                  'saved_object:canvas-workpad/find',
                  'saved_object:dashboard/bulk_get',
                  'saved_object:dashboard/get',
                  'saved_object:dashboard/find',
                  'ui:dashboard/show',
                  'ui:navLinks/kibana:dashboard',
                  'ui:catalogue/dashboard',
                ],
              },
              dev_tools: {
                read: [
                  'login:',
                  `version:${version}`,
                  'api:console/execute',
                  'app:kibana',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'ui:navLinks/kibana:dev_tools',
                  'ui:catalogue/console',
                  'ui:catalogue/searchprofiler',
                  'ui:catalogue/grokdebugger',
                ],
              },
              advancedSettings: {
                all: [
                  'login:',
                  `version:${version}`,
                  'app:kibana',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'saved_object:config/create',
                  'saved_object:config/bulk_create',
                  'saved_object:config/update',
                  'saved_object:config/delete',
                  'ui:catalogue/advanced_settings',
                  'ui:management/kibana/settings',
                ],
                read: [
                  'login:',
                  `version:${version}`,
                  'app:kibana',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'ui:catalogue/advanced_settings',
                  'ui:management/kibana/settings',
                ],
              },
              indexPatterns: {
                all: [
                  'login:',
                  `version:${version}`,
                  'app:kibana',
                  'saved_object:index-pattern/bulk_get',
                  'saved_object:index-pattern/get',
                  'saved_object:index-pattern/find',
                  'saved_object:index-pattern/create',
                  'saved_object:index-pattern/bulk_create',
                  'saved_object:index-pattern/update',
                  'saved_object:index-pattern/delete',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'ui:catalogue/index_patterns',
                  'ui:management/kibana/indices',
                ],
                read: [
                  'login:',
                  `version:${version}`,
                  'app:kibana',
                  'saved_object:index-pattern/bulk_get',
                  'saved_object:index-pattern/get',
                  'saved_object:index-pattern/find',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'ui:catalogue/index_patterns',
                  'ui:management/kibana/indices',
                ],
              },
              timelion: {
                all: [
                  'login:',
                  `version:${version}`,
                  'app:timelion',
                  'app:kibana',
                  'saved_object:timelion-sheet/bulk_get',
                  'saved_object:timelion-sheet/get',
                  'saved_object:timelion-sheet/find',
                  'saved_object:timelion-sheet/create',
                  'saved_object:timelion-sheet/bulk_create',
                  'saved_object:timelion-sheet/update',
                  'saved_object:timelion-sheet/delete',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'saved_object:index-pattern/bulk_get',
                  'saved_object:index-pattern/get',
                  'saved_object:index-pattern/find',
                  'ui:navLinks/timelion',
                  'ui:catalogue/timelion',
                ],
                read: [
                  'login:',
                  `version:${version}`,
                  'app:timelion',
                  'app:kibana',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'saved_object:index-pattern/bulk_get',
                  'saved_object:index-pattern/get',
                  'saved_object:index-pattern/find',
                  'saved_object:timelion-sheet/bulk_get',
                  'saved_object:timelion-sheet/get',
                  'saved_object:timelion-sheet/find',
                  'ui:navLinks/timelion',
                  'ui:catalogue/timelion',
                ],
              },
              graph: {
                all: [
                  'login:',
                  `version:${version}`,
                  'app:graph',
                  'app:kibana',
                  'saved_object:graph-workspace/bulk_get',
                  'saved_object:graph-workspace/get',
                  'saved_object:graph-workspace/find',
                  'saved_object:graph-workspace/create',
                  'saved_object:graph-workspace/bulk_create',
                  'saved_object:graph-workspace/update',
                  'saved_object:graph-workspace/delete',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'saved_object:index-pattern/bulk_get',
                  'saved_object:index-pattern/get',
                  'saved_object:index-pattern/find',
                  'ui:navLinks/graph',
                  'ui:catalogue/graph',
                ],
                read: [
                  'login:',
                  `version:${version}`,
                  'app:graph',
                  'app:kibana',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'saved_object:index-pattern/bulk_get',
                  'saved_object:index-pattern/get',
                  'saved_object:index-pattern/find',
                  'saved_object:graph-workspace/bulk_get',
                  'saved_object:graph-workspace/get',
                  'saved_object:graph-workspace/find',
                  'ui:navLinks/graph',
                  'ui:catalogue/graph',
                ],
              },
              monitoring: {
                all: [
                  'login:',
                  `version:${version}`,
                  'app:monitoring',
                  'app:kibana',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'ui:navLinks/monitoring',
                  'ui:catalogue/monitoring',
                ],
              },
              ml: {
                all: [
                  'login:',
                  `version:${version}`,
                  'app:ml',
                  'app:kibana',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'ui:navLinks/ml',
                  'ui:catalogue/ml',
                ],
              },
              apm: {
                all: [
                  'login:',
                  `version:${version}`,
                  'app:apm',
                  'app:kibana',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'ui:navLinks/apm',
                  'ui:catalogue/apm',
                ],
              },
              maps: {
                all: [
                  'login:',
                  `version:${version}`,
                  'app:maps',
                  'app:kibana',
                  'saved_object:map/bulk_get',
                  'saved_object:map/get',
                  'saved_object:map/find',
                  'saved_object:map/create',
                  'saved_object:map/bulk_create',
                  'saved_object:map/update',
                  'saved_object:map/delete',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'ui:navLinks/maps',
                  'ui:catalogue/maps',
                ],
                read: [
                  'login:',
                  `version:${version}`,
                  'app:maps',
                  'app:kibana',
                  'saved_object:map/bulk_get',
                  'saved_object:map/get',
                  'saved_object:map/find',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'ui:navLinks/maps',
                  'ui:catalogue/maps',
                ],
              },
              canvas: {
                all: [
                  'login:',
                  `version:${version}`,
                  'app:canvas',
                  'app:kibana',
                  'saved_object:canvas-workpad/bulk_get',
                  'saved_object:canvas-workpad/get',
                  'saved_object:canvas-workpad/find',
                  'saved_object:canvas-workpad/create',
                  'saved_object:canvas-workpad/bulk_create',
                  'saved_object:canvas-workpad/update',
                  'saved_object:canvas-workpad/delete',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'saved_object:index-pattern/bulk_get',
                  'saved_object:index-pattern/get',
                  'saved_object:index-pattern/find',
                  'ui:navLinks/canvas',
                  'ui:catalogue/canvas',
                ],
                read: [
                  'login:',
                  `version:${version}`,
                  'app:canvas',
                  'app:kibana',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'saved_object:index-pattern/bulk_get',
                  'saved_object:index-pattern/get',
                  'saved_object:index-pattern/find',
                  'saved_object:canvas-workpad/bulk_get',
                  'saved_object:canvas-workpad/get',
                  'saved_object:canvas-workpad/find',
                  'ui:navLinks/canvas',
                  'ui:catalogue/canvas',
                ],
              },
              infrastructure: {
                read: [
                  'login:',
                  `version:${version}`,
                  'app:infra',
                  'app:kibana',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'ui:navLinks/infra:home',
                  'ui:catalogue/infraops',
                ],
              },
              logs: {
                read: [
                  'login:',
                  `version:${version}`,
                  'app:infra',
                  'app:kibana',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'ui:navLinks/infra:logs',
                  'ui:catalogue/infralogging',
                ],
              },
              uptime: {
                read: [
                  'login:',
                  `version:${version}`,
                  'app:uptime',
                  'app:kibana',
                  'saved_object:config/bulk_get',
                  'saved_object:config/get',
                  'saved_object:config/find',
                  'ui:navLinks/uptime',
                  'ui:catalogue/uptime',
                ],
              },
            },
            global: {
              all: [
                'login:',
                `version:${version}`,
                'api:*',
                'app:*',
                'saved_object:*',
                'space:manage',
                'ui:*',
              ],
              read: [
                'login:',
                `version:${version}`,
                'api:console/execute',
                'app:*',
                'saved_object:config/bulk_get',
                'saved_object:config/get',
                'saved_object:config/find',
                'saved_object:migrationVersion/bulk_get',
                'saved_object:migrationVersion/get',
                'saved_object:migrationVersion/find',
                'saved_object:references/bulk_get',
                'saved_object:references/get',
                'saved_object:references/find',
                'saved_object:telemetry/bulk_get',
                'saved_object:telemetry/get',
                'saved_object:telemetry/find',
                'saved_object:graph-workspace/bulk_get',
                'saved_object:graph-workspace/get',
                'saved_object:graph-workspace/find',
                'saved_object:ml-telemetry/bulk_get',
                'saved_object:ml-telemetry/get',
                'saved_object:ml-telemetry/find',
                'saved_object:apm-telemetry/bulk_get',
                'saved_object:apm-telemetry/get',
                'saved_object:apm-telemetry/find',
                'saved_object:map/bulk_get',
                'saved_object:map/get',
                'saved_object:map/find',
                'saved_object:canvas-workpad/bulk_get',
                'saved_object:canvas-workpad/get',
                'saved_object:canvas-workpad/find',
                'saved_object:infrastructure-ui-source/bulk_get',
                'saved_object:infrastructure-ui-source/get',
                'saved_object:infrastructure-ui-source/find',
                'saved_object:upgrade-assistant-reindex-operation/bulk_get',
                'saved_object:upgrade-assistant-reindex-operation/get',
                'saved_object:upgrade-assistant-reindex-operation/find',
                'saved_object:index-pattern/bulk_get',
                'saved_object:index-pattern/get',
                'saved_object:index-pattern/find',
                'saved_object:visualization/bulk_get',
                'saved_object:visualization/get',
                'saved_object:visualization/find',
                'saved_object:search/bulk_get',
                'saved_object:search/get',
                'saved_object:search/find',
                'saved_object:dashboard/bulk_get',
                'saved_object:dashboard/get',
                'saved_object:dashboard/find',
                'saved_object:url/bulk_get',
                'saved_object:url/get',
                'saved_object:url/find',
                'saved_object:server/bulk_get',
                'saved_object:server/get',
                'saved_object:server/find',
                'saved_object:kql-telemetry/bulk_get',
                'saved_object:kql-telemetry/get',
                'saved_object:kql-telemetry/find',
                'saved_object:timelion-sheet/bulk_get',
                'saved_object:timelion-sheet/get',
                'saved_object:timelion-sheet/find',
                'ui:discover/show',
                'ui:dashboard/show',
                'ui:management/kibana/settings',
                'ui:management/kibana/indices',
                'ui:catalogue/discover',
                'ui:catalogue/visualize',
                'ui:catalogue/dashboard',
                'ui:catalogue/console',
                'ui:catalogue/searchprofiler',
                'ui:catalogue/grokdebugger',
                'ui:catalogue/advanced_settings',
                'ui:catalogue/index_patterns',
                'ui:catalogue/timelion',
                'ui:catalogue/graph',
                'ui:catalogue/monitoring',
                'ui:catalogue/ml',
                'ui:catalogue/apm',
                'ui:catalogue/maps',
                'ui:catalogue/canvas',
                'ui:catalogue/infraops',
                'ui:catalogue/infralogging',
                'ui:catalogue/uptime',
                'ui:navLinks/*',
              ],
            },
            space: {
              all: [
                'login:',
                `version:${version}`,
                'api:*',
                'app:*',
                'saved_object:config/bulk_get',
                'saved_object:config/get',
                'saved_object:config/find',
                'saved_object:config/create',
                'saved_object:config/bulk_create',
                'saved_object:config/update',
                'saved_object:config/delete',
                'saved_object:migrationVersion/bulk_get',
                'saved_object:migrationVersion/get',
                'saved_object:migrationVersion/find',
                'saved_object:migrationVersion/create',
                'saved_object:migrationVersion/bulk_create',
                'saved_object:migrationVersion/update',
                'saved_object:migrationVersion/delete',
                'saved_object:references/bulk_get',
                'saved_object:references/get',
                'saved_object:references/find',
                'saved_object:references/create',
                'saved_object:references/bulk_create',
                'saved_object:references/update',
                'saved_object:references/delete',
                'saved_object:telemetry/bulk_get',
                'saved_object:telemetry/get',
                'saved_object:telemetry/find',
                'saved_object:telemetry/create',
                'saved_object:telemetry/bulk_create',
                'saved_object:telemetry/update',
                'saved_object:telemetry/delete',
                'saved_object:graph-workspace/bulk_get',
                'saved_object:graph-workspace/get',
                'saved_object:graph-workspace/find',
                'saved_object:graph-workspace/create',
                'saved_object:graph-workspace/bulk_create',
                'saved_object:graph-workspace/update',
                'saved_object:graph-workspace/delete',
                'saved_object:ml-telemetry/bulk_get',
                'saved_object:ml-telemetry/get',
                'saved_object:ml-telemetry/find',
                'saved_object:ml-telemetry/create',
                'saved_object:ml-telemetry/bulk_create',
                'saved_object:ml-telemetry/update',
                'saved_object:ml-telemetry/delete',
                'saved_object:apm-telemetry/bulk_get',
                'saved_object:apm-telemetry/get',
                'saved_object:apm-telemetry/find',
                'saved_object:apm-telemetry/create',
                'saved_object:apm-telemetry/bulk_create',
                'saved_object:apm-telemetry/update',
                'saved_object:apm-telemetry/delete',
                'saved_object:map/bulk_get',
                'saved_object:map/get',
                'saved_object:map/find',
                'saved_object:map/create',
                'saved_object:map/bulk_create',
                'saved_object:map/update',
                'saved_object:map/delete',
                'saved_object:canvas-workpad/bulk_get',
                'saved_object:canvas-workpad/get',
                'saved_object:canvas-workpad/find',
                'saved_object:canvas-workpad/create',
                'saved_object:canvas-workpad/bulk_create',
                'saved_object:canvas-workpad/update',
                'saved_object:canvas-workpad/delete',
                'saved_object:infrastructure-ui-source/bulk_get',
                'saved_object:infrastructure-ui-source/get',
                'saved_object:infrastructure-ui-source/find',
                'saved_object:infrastructure-ui-source/create',
                'saved_object:infrastructure-ui-source/bulk_create',
                'saved_object:infrastructure-ui-source/update',
                'saved_object:infrastructure-ui-source/delete',
                'saved_object:upgrade-assistant-reindex-operation/bulk_get',
                'saved_object:upgrade-assistant-reindex-operation/get',
                'saved_object:upgrade-assistant-reindex-operation/find',
                'saved_object:upgrade-assistant-reindex-operation/create',
                'saved_object:upgrade-assistant-reindex-operation/bulk_create',
                'saved_object:upgrade-assistant-reindex-operation/update',
                'saved_object:upgrade-assistant-reindex-operation/delete',
                'saved_object:index-pattern/bulk_get',
                'saved_object:index-pattern/get',
                'saved_object:index-pattern/find',
                'saved_object:index-pattern/create',
                'saved_object:index-pattern/bulk_create',
                'saved_object:index-pattern/update',
                'saved_object:index-pattern/delete',
                'saved_object:visualization/bulk_get',
                'saved_object:visualization/get',
                'saved_object:visualization/find',
                'saved_object:visualization/create',
                'saved_object:visualization/bulk_create',
                'saved_object:visualization/update',
                'saved_object:visualization/delete',
                'saved_object:search/bulk_get',
                'saved_object:search/get',
                'saved_object:search/find',
                'saved_object:search/create',
                'saved_object:search/bulk_create',
                'saved_object:search/update',
                'saved_object:search/delete',
                'saved_object:dashboard/bulk_get',
                'saved_object:dashboard/get',
                'saved_object:dashboard/find',
                'saved_object:dashboard/create',
                'saved_object:dashboard/bulk_create',
                'saved_object:dashboard/update',
                'saved_object:dashboard/delete',
                'saved_object:url/bulk_get',
                'saved_object:url/get',
                'saved_object:url/find',
                'saved_object:url/create',
                'saved_object:url/bulk_create',
                'saved_object:url/update',
                'saved_object:url/delete',
                'saved_object:server/bulk_get',
                'saved_object:server/get',
                'saved_object:server/find',
                'saved_object:server/create',
                'saved_object:server/bulk_create',
                'saved_object:server/update',
                'saved_object:server/delete',
                'saved_object:kql-telemetry/bulk_get',
                'saved_object:kql-telemetry/get',
                'saved_object:kql-telemetry/find',
                'saved_object:kql-telemetry/create',
                'saved_object:kql-telemetry/bulk_create',
                'saved_object:kql-telemetry/update',
                'saved_object:kql-telemetry/delete',
                'saved_object:timelion-sheet/bulk_get',
                'saved_object:timelion-sheet/get',
                'saved_object:timelion-sheet/find',
                'saved_object:timelion-sheet/create',
                'saved_object:timelion-sheet/bulk_create',
                'saved_object:timelion-sheet/update',
                'saved_object:timelion-sheet/delete',
                'ui:*',
              ],
              read: [
                'login:',
                `version:${version}`,
                'api:console/execute',
                'app:*',
                'saved_object:config/bulk_get',
                'saved_object:config/get',
                'saved_object:config/find',
                'saved_object:migrationVersion/bulk_get',
                'saved_object:migrationVersion/get',
                'saved_object:migrationVersion/find',
                'saved_object:references/bulk_get',
                'saved_object:references/get',
                'saved_object:references/find',
                'saved_object:telemetry/bulk_get',
                'saved_object:telemetry/get',
                'saved_object:telemetry/find',
                'saved_object:graph-workspace/bulk_get',
                'saved_object:graph-workspace/get',
                'saved_object:graph-workspace/find',
                'saved_object:ml-telemetry/bulk_get',
                'saved_object:ml-telemetry/get',
                'saved_object:ml-telemetry/find',
                'saved_object:apm-telemetry/bulk_get',
                'saved_object:apm-telemetry/get',
                'saved_object:apm-telemetry/find',
                'saved_object:map/bulk_get',
                'saved_object:map/get',
                'saved_object:map/find',
                'saved_object:canvas-workpad/bulk_get',
                'saved_object:canvas-workpad/get',
                'saved_object:canvas-workpad/find',
                'saved_object:infrastructure-ui-source/bulk_get',
                'saved_object:infrastructure-ui-source/get',
                'saved_object:infrastructure-ui-source/find',
                'saved_object:upgrade-assistant-reindex-operation/bulk_get',
                'saved_object:upgrade-assistant-reindex-operation/get',
                'saved_object:upgrade-assistant-reindex-operation/find',
                'saved_object:index-pattern/bulk_get',
                'saved_object:index-pattern/get',
                'saved_object:index-pattern/find',
                'saved_object:visualization/bulk_get',
                'saved_object:visualization/get',
                'saved_object:visualization/find',
                'saved_object:search/bulk_get',
                'saved_object:search/get',
                'saved_object:search/find',
                'saved_object:dashboard/bulk_get',
                'saved_object:dashboard/get',
                'saved_object:dashboard/find',
                'saved_object:url/bulk_get',
                'saved_object:url/get',
                'saved_object:url/find',
                'saved_object:server/bulk_get',
                'saved_object:server/get',
                'saved_object:server/find',
                'saved_object:kql-telemetry/bulk_get',
                'saved_object:kql-telemetry/get',
                'saved_object:kql-telemetry/find',
                'saved_object:timelion-sheet/bulk_get',
                'saved_object:timelion-sheet/get',
                'saved_object:timelion-sheet/find',
                'ui:discover/show',
                'ui:dashboard/show',
                'ui:management/kibana/settings',
                'ui:management/kibana/indices',
                'ui:catalogue/discover',
                'ui:catalogue/visualize',
                'ui:catalogue/dashboard',
                'ui:catalogue/console',
                'ui:catalogue/searchprofiler',
                'ui:catalogue/grokdebugger',
                'ui:catalogue/advanced_settings',
                'ui:catalogue/index_patterns',
                'ui:catalogue/timelion',
                'ui:catalogue/graph',
                'ui:catalogue/monitoring',
                'ui:catalogue/ml',
                'ui:catalogue/apm',
                'ui:catalogue/maps',
                'ui:catalogue/canvas',
                'ui:catalogue/infraops',
                'ui:catalogue/infralogging',
                'ui:catalogue/uptime',
                'ui:navLinks/*',
              ],
            },
          });
      });
    });

    describe('GET /api/security/privileges', () => {
      it('should return a privilege map with all known privileges, without actions', async () => {
        await supertest
          .get('/api/security/privileges')
          .set('kbn-xsrf', 'xxx')
          .send()
          .expect(200, {
            features: {
              discover: ['all', 'read'],
              visualize: ['all', 'read'],
              dashboard: ['all', 'read'],
              dev_tools: ['read'],
              advancedSettings: ['all', 'read'],
              indexPatterns: ['all', 'read'],
              timelion: ['all', 'read'],
              graph: ['all', 'read'],
              monitoring: ['all'],
              ml: ['all'],
              apm: ['all'],
              maps: ['all', 'read'],
              canvas: ['all', 'read'],
              infrastructure: ['read'],
              logs: ['read'],
              uptime: ['read'],
            },
            global: ['all', 'read'],
            space: ['all', 'read'],
          });
      });
    });
  });
}
