/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { Feature, isFeaturePrivilegesCluster } from '../../../../../xpack_main/types';
import { Actions } from '../actions';

// this is "under test" by the disable_ui_capabilities, as we don't have other usages at this point.
// this should be treated as an implementation detail, and if we want it exposed publicly, we'll need
// to add more tests
export class FeaturesClusterPrivileges {
  private allClusterPrivileges: string[];
  private actionToClusterPrivileges: Record<string, string[]>;

  constructor(features: Feature[], actions: Actions) {
    this.allClusterPrivileges = features
      .map(feature => feature.privileges)
      .filter(isFeaturePrivilegesCluster)
      .reduce<string[]>((acc, privileges) => [...acc, ...Object.keys(privileges.cluster)], []);

    this.actionToClusterPrivileges = features.reduce<Record<string, string[]>>((acc, feature) => {
      if (!isFeaturePrivilegesCluster(feature.privileges)) {
        return acc;
      }

      for (const [clusterPrivilege, definition] of Object.entries(feature.privileges.cluster)) {
        if (feature.navLinkId && definition.ui.navLink) {
          const action = actions.ui.get('navLinks', feature.navLinkId!);
          acc[action] = [...(acc[action] || []), clusterPrivilege];
        }

        if (definition.ui.capability) {
          for (const capability of definition.ui.capability) {
            const action = actions.ui.get(feature.id, capability);
            acc[action] = [...(acc[action] || []), clusterPrivilege];
          }
        }
      }

      return acc;
    }, {});
  }

  public getAllClusterPrivileges() {
    return this.allClusterPrivileges;
  }

  public isActionEnabled(
    action: string,
    checkPrivilegesResponseClusterPrivileges: Record<string, boolean | undefined>
  ) {
    const clusterPrivileges = this.actionToClusterPrivileges[action];
    if (!clusterPrivileges) {
      return null;
    }

    return clusterPrivileges.every(
      clusterPrivilege => checkPrivilegesResponseClusterPrivileges[clusterPrivilege] === true
    );
  }
}
