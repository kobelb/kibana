/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { Dictionary, flatten, mapValues } from 'lodash';
import { Feature, isFeaturePrivilegesKibana } from '../../../../xpack_main/types';
import { Actions } from './actions';

export type FeaturesPrivileges = Record<string, Record<string, string[]>>;

export class FeaturesPrivilegesBuilder {
  private actions: Actions;

  constructor(actions: Actions) {
    this.actions = actions;
  }

  public buildFeaturesPrivileges(features: Feature[]): FeaturesPrivileges {
    return features.reduce((acc: FeaturesPrivileges, feature: Feature) => {
      acc[feature.id] = this.buildFeaturePrivileges(feature);
      return acc;
    }, {});
  }

  public getApiReadActions(features: Feature[]): string[] {
    return flatten(
      features.map(feature => {
        const { privileges } = feature;
        if (!privileges || !isFeaturePrivilegesKibana(privileges)) {
          return [];
        }

        if (!privileges.kibana.read || !privileges.kibana.read.api) {
          return [];
        }

        const { api } = privileges.kibana.read;

        return api!.map(operation => this.actions.api.get(operation));
      })
    );
  }

  public getUIReadActions(features: Feature[]): string[] {
    return flatten(
      features.map(feature => {
        const { privileges } = feature;
        if (!privileges || !isFeaturePrivilegesKibana(privileges)) {
          return [];
        }

        if (!privileges.kibana.read || !privileges.kibana.read.ui) {
          return [];
        }

        const { ui } = privileges.kibana.read;

        return [
          ...(ui.capability
            ? ui.capability.map(uiCapability => this.actions.ui.get(feature.id, uiCapability))
            : []),
          ...(feature.navLinkId && ui.navLink
            ? [this.actions.ui.get('navLinks', feature.navLinkId)]
            : []),
        ];
      })
    );
  }

  private buildFeaturePrivileges(feature: Feature): Dictionary<string[]> {
    if (!isFeaturePrivilegesKibana(feature.privileges)) {
      return {};
    }

    return mapValues(feature.privileges.kibana!, privilegeDefinition => [
      this.actions.login,
      this.actions.version,
      ...(privilegeDefinition.api
        ? privilegeDefinition.api.map(api => this.actions.api.get(api))
        : []),
      ...privilegeDefinition.app.map(appId => this.actions.app.get(appId)),
      ...flatten(
        privilegeDefinition.savedObject.all.map(types =>
          this.actions.savedObject.allOperations(types)
        )
      ),
      ...flatten(
        privilegeDefinition.savedObject.read.map(types =>
          this.actions.savedObject.readOperations(types)
        )
      ),
      ...(privilegeDefinition.ui.capability
        ? privilegeDefinition.ui.capability.map(uiCapability =>
            this.actions.ui.get(feature.id, uiCapability)
          )
        : []),
      ...(feature.navLinkId && privilegeDefinition.ui.navLink
        ? [this.actions.ui.get('navLinks', feature.navLinkId)]
        : []),
    ]);
  }
}
