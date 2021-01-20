/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * and the Server Side Public License, v 1; you may not use this file except in
 * compliance with, at your election, the Elastic License or the Server Side
 * Public License, v 1.
 */

import { UiActionsStart, UiActionsSetup } from '../../../src/plugins/ui_actions/public';
import { Plugin, CoreSetup, AppMountParameters, AppNavLinkStatus } from '../../../src/core/public';
import {
  PHONE_TRIGGER,
  USER_TRIGGER,
  COUNTRY_TRIGGER,
  lookUpWeatherAction,
  viewInMapsAction,
  createEditUserAction,
  makePhoneCallAction,
  showcasePluggability,
  UserContext,
  CountryContext,
  PhoneContext,
  ACTION_EDIT_USER,
  ACTION_SHOWCASE_PLUGGABILITY,
  ACTION_CALL_PHONE_NUMBER,
  ACTION_TRAVEL_GUIDE,
  ACTION_VIEW_IN_MAPS,
  ACTION_TRIGGER_PHONE_USER,
  createTriggerPhoneTriggerAction,
} from './actions/actions';
import { DeveloperExamplesSetup } from '../../developer_examples/public';
import image from './ui_actions.png';

interface StartDeps {
  uiActions: UiActionsStart;
}

interface SetupDeps {
  uiActions: UiActionsSetup;
  developerExamples: DeveloperExamplesSetup;
}

declare module '../../../src/plugins/ui_actions/public' {
  export interface TriggerContextMapping {
    [USER_TRIGGER]: UserContext;
    [COUNTRY_TRIGGER]: CountryContext;
    [PHONE_TRIGGER]: PhoneContext;
  }

  export interface ActionContextMapping {
    [ACTION_EDIT_USER]: UserContext;
    [ACTION_SHOWCASE_PLUGGABILITY]: {};
    [ACTION_CALL_PHONE_NUMBER]: PhoneContext;
    [ACTION_TRAVEL_GUIDE]: CountryContext;
    [ACTION_VIEW_IN_MAPS]: CountryContext;
    [ACTION_TRIGGER_PHONE_USER]: UserContext;
  }
}

export class UiActionsExplorerPlugin implements Plugin<void, void, {}, StartDeps> {
  public setup(core: CoreSetup<StartDeps>, deps: SetupDeps) {
    deps.uiActions.registerTrigger({
      id: COUNTRY_TRIGGER,
    });
    deps.uiActions.registerTrigger({
      id: PHONE_TRIGGER,
    });
    deps.uiActions.registerTrigger({
      id: USER_TRIGGER,
    });

    const startServices = core.getStartServices();

    deps.uiActions.addTriggerAction(
      USER_TRIGGER,
      createTriggerPhoneTriggerAction(async () => (await startServices)[1].uiActions)
    );
    deps.uiActions.addTriggerAction(
      USER_TRIGGER,
      createEditUserAction(async () => (await startServices)[0].overlays.openModal)
    );

    deps.uiActions.addTriggerAction(COUNTRY_TRIGGER, viewInMapsAction);
    deps.uiActions.addTriggerAction(COUNTRY_TRIGGER, lookUpWeatherAction);
    deps.uiActions.addTriggerAction(COUNTRY_TRIGGER, showcasePluggability);
    deps.uiActions.addTriggerAction(PHONE_TRIGGER, makePhoneCallAction);
    deps.uiActions.addTriggerAction(PHONE_TRIGGER, showcasePluggability);
    deps.uiActions.addTriggerAction(USER_TRIGGER, showcasePluggability);

    core.application.register({
      id: 'uiActionsExplorer',
      title: 'Ui Actions Explorer',
      navLinkStatus: AppNavLinkStatus.hidden,
      async mount(params: AppMountParameters) {
        const [coreStart, depsStart] = await core.getStartServices();
        const { renderApp } = await import('./app');
        return renderApp(
          { uiActionsApi: depsStart.uiActions, openModal: coreStart.overlays.openModal },
          params
        );
      },
    });

    deps.developerExamples.register({
      appId: 'uiActionsExplorer',
      title: 'Ui Actions & Triggers',
      description: `Ui Actions can be used to make any part of your UI extensible. It has built in support for
      context menus, but you can also render all actions attached to a given trigger however you like, just how
      panel badges and panel notifications does.`,
      image,
      links: [
        {
          label: 'README',
          href: 'https://github.com/elastic/kibana/blob/master/src/plugins/ui_actions/README.md',
          iconType: 'logoGithub',
          size: 's',
          target: '_blank',
        },
      ],
    });
  }

  public start() {}

  public stop() {}
}
