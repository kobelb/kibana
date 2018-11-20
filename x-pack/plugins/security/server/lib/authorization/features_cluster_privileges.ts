/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { Feature, isFeaturePrivilegesCluster } from '../../../../xpack_main/types';
import { Actions } from './actions';

export class FeaturesClusterPrivileges {
  private allClusterPrivileges: string[];
  private actionToClusterPrivileges: Record<string, string[]>;

  constructor(features: Feature[], actions: Actions) {
    this.allClusterPrivileges = features
      .map(feature => feature.privileges)
      .filter(isFeaturePrivilegesCluster)
      .reduce<string[]>((acc, privileges) => [...acc, ...privileges.cluster], []);

    this.actionToClusterPrivileges = features
      .filter(feature => feature.navLinkId)
      .reduce<Record<string, string[]>>((acc, feature) => {
        if (!isFeaturePrivilegesCluster(feature.privileges)) {
          return acc;
        }

        const action = actions.ui.get('navLinks', feature.navLinkId!);
        acc[action] = [...(acc[action] || []), ...feature.privileges.cluster];
        return acc;
      }, {});
  }

  public getAllClusterPrivileges() {
    return this.allClusterPrivileges;
  }

  public isActionEnabled(
    action: string,
    checkPrivilegesResponseClusterPrivileges: Record<string, boolean>
  ) {
    const clusterPrivileges = this.actionToClusterPrivileges[action];
    if (!clusterPrivileges || clusterPrivileges.length === 0) {
      return false;
    }

    return clusterPrivileges.every(
      clusterPrivilege => checkPrivilegesResponseClusterPrivileges[clusterPrivilege] === true
    );
  }
}
