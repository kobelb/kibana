/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements.
 * Licensed under the Elastic License; you may not use this file except in compliance with the Elastic License. */

import { getClient } from '../../../../../../server/lib/get_client_shield';
import { createDefaultRoles } from '../../../lib/authorization/create_default_roles';
import { wrapError } from '../../../lib/errors';

export function initInitializeRbacApi(server) {
  const callWithRequest = getClient(server).callWithRequest;

  server.route({
    method: 'POST',
    path: '/api/security/v1/initialize_rbac',
    async handler(request, reply) {
      try {
        const callCluster = (...args) => callWithRequest(request, ...args);
        await createDefaultRoles(server.config(), callCluster);
        reply(true);
      } catch (err) {
        reply(wrapError(err));
      }
    }
  });
}
