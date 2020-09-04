/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { KibanaRequest } from 'kibana/server';

export class ConcurrentRequests {
  readonly #requestUuids = new Set<string>();
  readonly #max: number;

  constructor(max: number) {
    this.#max = max;
  }

  add(request: KibanaRequest) {
    this.#requestUuids.add(request.uuid);
  }

  remove(request: KibanaRequest) {
    this.#requestUuids.delete(request.uuid);
  }

  valueOf() {
    return this.#requestUuids.size;
  }

  lessThanMax() {
    return this.#requestUuids.size < this.#max;
  }
}
