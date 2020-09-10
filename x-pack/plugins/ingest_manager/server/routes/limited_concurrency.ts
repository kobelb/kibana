/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import {
  CoreSetup,
  KibanaRequest,
  LifecycleResponseFactory,
  OnPreRoutingToolkit,
} from 'kibana/server';
import { IngestManagerConfigType } from '../index';
import { ConcurrentRequests } from './concurrent_requests';

export function isLimitedRoute(request: KibanaRequest) {
  if (request.url.pathname == null) {
    return false;
  }
  return (
    request.url.pathname === '/api/ingest_manager/fleet/agents/enroll' ||
    /\/api\/ingest_manager\/fleet\/agents\/[^\/]+\/checkin/.test(request.url.pathname!)
  );
}

export function createLimitedOnPreRoutingHandler({
  isMatch,
  concurrentRequests,
}: {
  isMatch: (request: KibanaRequest) => boolean;
  concurrentRequests: ConcurrentRequests;
}) {
  return function preRoutingHandler(
    request: KibanaRequest,
    response: LifecycleResponseFactory,
    toolkit: OnPreRoutingToolkit
  ) {
    if (!isMatch(request)) {
      return toolkit.next();
    }

    if (!concurrentRequests.lessThanMax()) {
      return response.customError({
        body: 'Too Many Requests',
        statusCode: 429,
      });
    }

    concurrentRequests.add(request);

    request.events.completed$.toPromise().then(() => {
      concurrentRequests.remove(request);
    });

    return toolkit.next();
  };
}

export function registerLimitedConcurrencyRoutes(
  core: CoreSetup,
  config: IngestManagerConfigType,
  concurrentRequests: ConcurrentRequests
) {
  const max = config.fleet.maxConcurrentConnections;
  if (!max) return;

  core.http.registerOnPreRouting(
    createLimitedOnPreRoutingHandler({
      isMatch: isLimitedRoute,
      concurrentRequests,
    })
  );
}
