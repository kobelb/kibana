/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { Server } from 'hapi';
import { XPackFeature } from 'x-pack/plugins/xpack_main/server/lib/xpack_info';
import { XPackMainPlugin } from 'x-pack/plugins/xpack_main/xpack_main';
// @ts-ignore
import { getClient } from '../../../../../server/lib/get_client_shield';
import { Actions, actionsFactory } from './actions';
import { CheckPrivilegesWithRequest, checkPrivilegesWithRequestFactory } from './check_privileges';
import {
  CheckPrivilegesDynamicallyWithRequest,
  checkPrivilegesDynamicallyWithRequestFactory,
} from './check_privileges_dynamically';
import { AuthorizationMode, authorizationModeFactory } from './mode';
import { privilegesFactory } from './privileges';
import { PrivilegesService } from './privileges/privileges';

export interface AuthorizationService {
  actions: Actions;
  application: string;
  checkPrivilegesWithRequest: CheckPrivilegesWithRequest;
  checkPrivilegesDynamicallyWithRequest: CheckPrivilegesDynamicallyWithRequest;
  mode: AuthorizationMode;
  privileges: PrivilegesService;
}

export function createAuthorizationService(
  server: Server,
  xpackInfoFeature: XPackFeature,
  xpackMainPlugin: XPackMainPlugin,
  spaces: any
) {
  const shieldClient = getClient(server);
  const config = server.config();

  const actions = actionsFactory(config);
  const application = `kibana-${config.get('kibana.index')}`;
  const checkPrivilegesWithRequest = checkPrivilegesWithRequestFactory(
    actions,
    application,
    shieldClient
  );
  const checkPrivilegesDynamicallyWithRequest = checkPrivilegesDynamicallyWithRequestFactory(
    checkPrivilegesWithRequest,
    spaces
  );
  const mode = authorizationModeFactory(xpackInfoFeature);
  const privileges = privilegesFactory(actions, xpackMainPlugin);

  return {
    actions,
    application,
    checkPrivilegesWithRequest,
    checkPrivilegesDynamicallyWithRequest,
    mode,
    privileges,
  };
}
