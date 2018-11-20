/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { mapValues } from 'lodash';
import { UICapabilities } from 'ui/capabilities';
import { Feature, isFeaturePrivilegesCluster } from '../../../../xpack_main/types';
import { Actions } from './actions';
import { CheckPrivilegesAtResourceResponse } from './check_privileges';
import { CheckPrivilegesDynamically } from './check_privileges_dynamically';

export function disableUICapabilitesFactory(
  server: Record<string, any>,
  request: Record<string, any>
) {
  const { authorization } = server.plugins.security;
  const actions: Actions = authorization.actions;

  const disableAll = (uiCapabilities: UICapabilities) => {
    return mapValues(uiCapabilities, featureUICapabilities =>
      mapValues(featureUICapabilities, () => false)
    );
  };

  const usingPrivileges = async (uiCapabilities: UICapabilities) => {
    const features: Feature[] = server.plugins.xpack_main.getFeatures();
    const clusterPrivileges = features
      .map(feature => feature.privileges)
      .filter(isFeaturePrivilegesCluster)
      .reduce<string[]>((acc, privileges) => [...acc, ...privileges.cluster], []);

    const uiActions = Object.entries(uiCapabilities).reduce<string[]>(
      (acc, [featureId, featureUICapabilities]) => [
        ...acc,
        ...Object.keys(featureUICapabilities).map(uiCapability =>
          actions.ui.get(featureId, uiCapability)
        ),
      ],
      []
    );

    let checkPrivilegesResponse: CheckPrivilegesAtResourceResponse;
    try {
      const checkPrivilegesDynamically: CheckPrivilegesDynamically = authorization.checkPrivilegesDynamicallyWithRequest(
        request
      );
      checkPrivilegesResponse = await checkPrivilegesDynamically(uiActions, clusterPrivileges);
    } catch (err) {
      // if we get a 401/403, then we want to disable all uiCapabilities, as this
      // is generally when the user hasn't authenticated yet and we're displaying the
      // login screen, which isn't driven any uiCapabilities
      if (err.statusCode === 401 || err.statusCode === 403) {
        return disableAll(uiCapabilities);
      }
      throw err;
    }

    const clusterBasedFeatures = features
      .filter(feature => feature.navLinkId)
      .reduce<Record<string, any>>((acc, feature) => {
        if (!isFeaturePrivilegesCluster(feature.privileges)) {
          return acc;
        }

        const enabled = feature.privileges.cluster.every(
          clusterPrivilege => checkPrivilegesResponse.clusterPrivileges[clusterPrivilege] === true
        );
        return {
          ...acc,
          [actions.ui.get('navLinks', feature.navLinkId!)]: enabled,
        };
      }, {});

    return mapValues(uiCapabilities, (featureUICapabilities, featureId) => {
      return mapValues(featureUICapabilities, (enabled, uiCapability) => {
        // if the uiCapability has already been disabled, we don't want to re-enable it
        if (!enabled) {
          return false;
        }

        const action = actions.ui.get(featureId!, uiCapability!);
        return (
          checkPrivilegesResponse.privileges[action] === true ||
          clusterBasedFeatures[action] === true
        );
      });
    });
  };

  return {
    all: disableAll,
    usingPrivileges,
  };
}
