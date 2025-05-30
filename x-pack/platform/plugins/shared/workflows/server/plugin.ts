import type {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '@kbn/core/server';
import type { TaskManagerSetupContract as TaskManagerSetup, TaskManagerStartContract as TaskManagerStart } from '@kbn/task-manager-plugin/server';
import type { PluginSetupContract as ActionsPluginSetup, PluginStartContract as ActionsPluginStart } from '@kbn/actions-plugin/server';

import type { WorkflowsPluginSetup, WorkflowsPluginStart } from './types';
import { defineRoutes } from './routes';

export class WorkflowsPlugin implements Plugin<WorkflowsPluginSetup, WorkflowsPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(
    core: CoreSetup,
    plugins: { 
      taskManager: TaskManagerSetup,
      actions: ActionsPluginSetup
    }
  ) {
    this.logger.debug('workflows: Setup');
    const router = core.http.createRouter();

    defineRoutes(router);

    const workflowLogger = this.logger;
    plugins.taskManager.registerTaskDefinitions({
      'workflows:recurring-log': {
        title: 'Workflows Recurring Log Task',
        createTaskRunner: ({ taskInstance }) => ({
          run: async () => {
            workflowLogger.info('Workflows recurring task executed');
            return { state: {} };
          },
        }),
      },
    }); 

    return {};
  }

  public start(
    core: CoreStart,
    plugins: { 
      taskManager: TaskManagerStart,
      actions: ActionsPluginStart
    }
  ) {
    this.logger.debug('workflows: Started');

     plugins.taskManager.ensureScheduled({
      id: 'workflows-recurring-log-task',
      taskType: 'workflows:recurring-log',
      schedule: { interval: '5s' },
      state: {},
      params: {},
      scope: ['workflows'],
    });
    
    return {};
  }

  public stop() {}
}
