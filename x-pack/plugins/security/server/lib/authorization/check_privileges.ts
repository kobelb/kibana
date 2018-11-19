/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { pick, transform, uniq } from 'lodash';
import { GLOBAL_RESOURCE } from '../../../common/constants';
import { ResourceSerializer } from './resource_serializer';
import { HasPrivilegesResponse, HasPrivilegesResponseApplication } from './types';
import { validateEsPrivilegeResponse } from './validate_es_response';

interface CheckPrivilegesActions {
  login: string;
  version: string;
}

interface CheckPrivilegesAtResourcesResponse {
  hasAllRequested: boolean;
  username: string;
  resourcePrivileges: {
    [resource: string]: {
      [privilege: string]: boolean;
    };
  };
  clusterPrivileges: {
    [privilege: string]: boolean;
  };
}

export interface CheckPrivilegesAtResourceResponse {
  hasAllRequested: boolean;
  username: string;
  privileges: {
    [privilege: string]: boolean;
  };
  clusterPrivileges: {
    [privilege: string]: boolean;
  };
}

export interface CheckPrivilegesAtSpacesResponse {
  hasAllRequested: boolean;
  username: string;
  spacePrivileges: {
    [spaceId: string]: {
      [privilege: string]: boolean;
    };
  };
  clusterPrivileges: {
    [privilege: string]: boolean;
  };
}

export type CheckPrivilegesWithRequest = (request: any) => CheckPrivileges;

export interface CheckPrivileges {
  atSpace(
    spaceId: string,
    privilegeOrPrivileges: string | string[],
    clusterPrivileges?: string[]
  ): Promise<CheckPrivilegesAtResourceResponse>;
  atSpaces(
    spaceIds: string[],
    privilegeOrPrivileges: string | string[],
    clusterPrivileges?: string[]
  ): Promise<CheckPrivilegesAtSpacesResponse>;
  globally(
    privilegeOrPrivileges: string | string[],
    clusterPrivileges?: string[]
  ): Promise<CheckPrivilegesAtResourceResponse>;
}

export function checkPrivilegesWithRequestFactory(
  actions: CheckPrivilegesActions,
  application: string,
  shieldClient: any
) {
  const { callWithRequest } = shieldClient;

  const hasIncompatibileVersion = (
    applicationPrivilegesResponse: HasPrivilegesResponseApplication
  ) => {
    return Object.values(applicationPrivilegesResponse).some(
      resource => !resource[actions.version] && resource[actions.login]
    );
  };

  return function checkPrivilegesWithRequest(request: any): CheckPrivileges {
    const checkPrivilegesAtResources = async (
      resources: string[],
      privilegeOrPrivileges: string | string[],
      clusterPrivileges?: string[]
    ): Promise<CheckPrivilegesAtResourcesResponse> => {
      const privileges = Array.isArray(privilegeOrPrivileges)
        ? privilegeOrPrivileges
        : [privilegeOrPrivileges];
      const allApplicationPrivileges = uniq([actions.version, actions.login, ...privileges]);

      const hasPrivilegesResponse: HasPrivilegesResponse = await callWithRequest(
        request,
        'shield.hasPrivileges',
        {
          body: {
            cluster: clusterPrivileges,
            applications: [
              {
                application,
                resources,
                privileges: allApplicationPrivileges,
              },
            ],
          },
        }
      );

      validateEsPrivilegeResponse(
        hasPrivilegesResponse,
        application,
        allApplicationPrivileges,
        resources
      );

      const applicationPrivilegesResponse = hasPrivilegesResponse.application[application];

      if (hasIncompatibileVersion(applicationPrivilegesResponse)) {
        throw new Error(
          'Multiple versions of Kibana are running against the same Elasticsearch cluster, unable to authorize user.'
        );
      }

      return {
        hasAllRequested: hasPrivilegesResponse.has_all_requested,
        username: hasPrivilegesResponse.username,
        // we need to filter out the non requested privileges from the response
        resourcePrivileges: transform(applicationPrivilegesResponse, (result, value, key) => {
          result[key!] = pick(value, privileges);
        }),
        clusterPrivileges: hasPrivilegesResponse.cluster,
      };
    };

    const checkPrivilegesAtResource = async (
      resource: string,
      privilegeOrPrivileges: string | string[],
      clusterPrivileges?: string[]
    ): Promise<CheckPrivilegesAtResourceResponse> => {
      const response = await checkPrivilegesAtResources(
        [resource],
        privilegeOrPrivileges,
        clusterPrivileges
      );

      return {
        hasAllRequested: response.hasAllRequested,
        username: response.username,
        privileges: response.resourcePrivileges[resource],
        clusterPrivileges: response.clusterPrivileges,
      };
    };

    return {
      async atSpace(
        spaceId: string,
        privilegeOrPrivileges: string | string[],
        clusterPrivileges?: string[]
      ) {
        const spaceResource = ResourceSerializer.serializeSpaceResource(spaceId);
        return await checkPrivilegesAtResource(
          spaceResource,
          privilegeOrPrivileges,
          clusterPrivileges
        );
      },
      async atSpaces(
        spaceIds: string[],
        privilegeOrPrivileges: string | string[],
        clusterPrivileges?: string[]
      ) {
        const spaceResources = spaceIds.map(spaceId =>
          ResourceSerializer.serializeSpaceResource(spaceId)
        );
        const response = await checkPrivilegesAtResources(
          spaceResources,
          privilegeOrPrivileges,
          clusterPrivileges
        );
        return {
          hasAllRequested: response.hasAllRequested,
          username: response.username,
          // we need to turn the resource responses back into the space ids
          spacePrivileges: transform(response.resourcePrivileges, (result, value, key) => {
            result[ResourceSerializer.deserializeSpaceResource(key!)] = value;
          }),
          clusterPrivileges: response.clusterPrivileges,
        };
      },
      async globally(privilegeOrPrivileges: string | string[], clusterPrivileges?: string[]) {
        return await checkPrivilegesAtResource(
          GLOBAL_RESOURCE,
          privilegeOrPrivileges,
          clusterPrivileges
        );
      },
    };
  };
}
