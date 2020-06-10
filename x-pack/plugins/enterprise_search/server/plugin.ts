/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import AbortController from 'abort-controller';
import fetch from 'node-fetch';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import {
  Plugin,
  PluginInitializerContext,
  CoreSetup,
  Logger,
  SavedObjectsServiceStart,
  IRouter,
  KibanaRequest,
} from 'src/core/server';
import { UsageCollectionSetup } from 'src/plugins/usage_collection/server';

import { UICapabilities } from 'ui/capabilities';
import { SecurityPluginSetup } from '../../security/server';
import { registerEnginesRoute } from './routes/app_search/engines';
import { registerTelemetryRoute } from './routes/app_search/telemetry';
import { registerTelemetryUsageCollector } from './collectors/app_search/telemetry';
import { appSearchTelemetryType } from './saved_objects/app_search/telemetry';

export interface PluginsSetup {
  usageCollection?: UsageCollectionSetup;
  security: SecurityPluginSetup;
}

export interface ServerConfigType {
  host?: string;
}

export interface IRouteDependencies {
  router: IRouter;
  config: ServerConfigType;
  log: Logger;
  getSavedObjectsService?(): SavedObjectsServiceStart;
}

export class EnterpriseSearchPlugin implements Plugin {
  private config: Observable<ServerConfigType>;
  private logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.config = initializerContext.config.create<ServerConfigType>();
    this.logger = initializerContext.logger.get();
  }

  public async setup(
    { capabilities, http, savedObjects, getStartServices }: CoreSetup,
    { usageCollection, security }: PluginsSetup
  ) {
    const router = http.createRouter();
    const config = await this.config.pipe(first()).toPromise();
    const dependencies = { router, config, log: this.logger };

    capabilities.registerProvider(() => {
      return {
        navLinks: {
          app_search: true,
        },
      };
    });

    capabilities.registerSwitcher(
      async (request: KibanaRequest, uiCapabilities: UICapabilities) => {
        const showAppSearch = async () => {
          if (config.host == null) {
            if (!security?.authz?.mode.useRbacForRequest(request)) {
              return true;
            }

            try {
              const { hasAllRequested } = await security.authz
                .checkPrivilegesWithRequest(request)
                .globally(security.authz.actions.ui.get('enterprise_search', 'app_search'));

              return hasAllRequested;
            } catch (err) {
              if (err.statusCode === 401 || err.statusCode === 403) {
                return false;
              }

              throw err;
            }
          }

          let timeout;
          try {
            const controller = new AbortController();
            timeout = setTimeout(() => {
              controller.abort();
            }, config.privilegeCheckTimeout);
            const response = await fetch(config.host!, {
              headers: { Authorization: request.headers.authorization as string },
            });
            return response.ok;
          } catch (err) {
            if (err.name === 'AbortError') {
              // log a warning if we hit the timeout...
              // we don't want to prevent users from seeing Kibana if the host is misconfigured or slow to respond
            } else {
              // we'll want to log a warning if we get any unexpected error also
            }
            return false;
          } finally {
            if (timeout != null) {
              clearTimeout(timeout);
            }
          }
        };

        return {
          ...uiCapabilities,
          navLinks: {
            ...uiCapabilities.navLinks,
            app_search: await showAppSearch(),
          },
        };
      }
    );

    registerEnginesRoute(dependencies);

    /**
     * Bootstrap the routes, saved objects, and collector for telemetry
     */
    savedObjects.registerType(appSearchTelemetryType);

    getStartServices().then(([coreStart]) => {
      const savedObjectsStarted = coreStart.savedObjects as SavedObjectsServiceStart;

      registerTelemetryRoute({
        ...dependencies,
        getSavedObjectsService: () => savedObjectsStarted,
      });
      if (usageCollection) {
        registerTelemetryUsageCollector(usageCollection, savedObjectsStarted);
      }
    });
  }

  public start() {}

  public stop() {}
}
