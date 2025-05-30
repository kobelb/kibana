import type {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '@kbn/core/server';
import type { TaskManagerSetupContract, TaskManagerStartContract } from '@kbn/task-manager-plugin/server';

import type { WorkflowsPluginSetup, WorkflowsPluginStart } from './types';
import { defineRoutes } from './routes';

export class WorkflowsPlugin implements Plugin<WorkflowsPluginSetup, WorkflowsPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup, plugins: { taskManager: TaskManagerSetupContract }) {
    this.logger.debug('workflows: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    // Example usage:
    // plugins.taskManager.registerTaskDefinitions(...);

    return {};
  }

  public start(core: CoreStart, plugins: { taskManager: TaskManagerStartContract }) {
    this.logger.debug('workflows: Started');
    // Example usage:
    // plugins.taskManager.someStartMethod(...);
    return {};
  }

  public stop() {}
}
