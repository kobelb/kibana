import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../core/server';

import { JerkPluginPluginSetup, JerkPluginPluginStart } from './types';

export class JerkPluginPlugin implements Plugin<JerkPluginPluginSetup, JerkPluginPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    core.http.registerOnPreAuth((request, response, toolkit) => {
      return response.customError({
        body: 'NOOOOOOOO!!!',
        statusCode: 429,
      });
    });

    return {};
  }

  public start(core: CoreStart) {
    return {};
  }

  public stop() {}
}
