/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import {
  CoreSetup,
  KibanaRequest,
  LifecycleResponseFactory,
  OnPreAuthToolkit,
} from 'kibana/server';
import { LIMITED_CONCURRENCY_ROUTE_TAG } from '../../common';
import { IngestManagerConfigType } from '../index';
import { ConcurrentRequests } from './concurrent_requests';

export function isLimitedRoute(request: KibanaRequest) {
  const tags = request.route.options.tags;
  return !!tags.includes(LIMITED_CONCURRENCY_ROUTE_TAG);
}

export function createLimitedPreAuthHandler({
  isMatch,
  concurrentRequests,
}: {
  isMatch: (request: KibanaRequest) => boolean;
  concurrentRequests: ConcurrentRequests;
}) {
  return function preAuthHandler(
    request: KibanaRequest,
    response: LifecycleResponseFactory,
    toolkit: OnPreAuthToolkit
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

  core.http.registerOnPreAuth(
    createLimitedPreAuthHandler({
      isMatch: isLimitedRoute,
      concurrentRequests,
    })
  );
}
