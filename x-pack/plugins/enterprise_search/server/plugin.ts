/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import {
  Plugin,
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  SavedObjectsServiceStart,
} from 'src/core/server';
import { UsageCollectionSetup } from 'src/plugins/usage_collection/server';

import { registerEnginesRoute } from './routes/app_search/engines';
import { registerTelemetryRoute } from './routes/app_search/telemetry';
import { registerTelemetryUsageCollector } from './collectors/app_search/telemetry';
import { appSearchTelemetryType } from './saved_objects/app_search/telemetry';

export interface PluginsSetup {
  usageCollection?: UsageCollectionSetup;
}

export interface ServerConfigType {
  host?: string;
}

export class EnterpriseSearchPlugin implements Plugin {
  private config: Observable<ServerConfigType>;
  private savedObjects?: SavedObjectsServiceStart;

  constructor(initializerContext: PluginInitializerContext) {
    this.config = initializerContext.config.create<ServerConfigType>();
  }

  public async setup(
    { http, savedObjects, getStartServices }: CoreSetup,
    { usageCollection }: PluginsSetup
  ) {
    const router = http.createRouter();
    const config = await this.config.pipe(first()).toPromise();
    const dependencies = { router, config };

    registerEnginesRoute(dependencies);

    /**
     * Bootstrap the routes, saved objects, and collector for telemetry
     */
    registerTelemetryRoute({
      ...dependencies,
      getSavedObjectsService: () => {
        if (!this.savedObjectsServiceStart) {
          throw new Error('Saved Objects Start service not available');
        }
        return this.savedObjectsServiceStart;
      },
    });
    savedObjects.registerType(appSearchTelemetryType);
    if (usageCollection) {
      getStartServices().then(([{ savedObjects: savedObjectsStarted }]) => {
        registerTelemetryUsageCollector({ usageCollection, savedObjects: savedObjectsStarted });
      });
    }
  }

  public start({ savedObjects }: CoreStart) {
    this.savedObjectsServiceStart = savedObjects;
  }

  public stop() {}
}
