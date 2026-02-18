/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { inject, injectable } from 'inversify';
import { PluginStart } from '@kbn/core-di';
import { Request } from '@kbn/core-di-server';
import type { KibanaRequest } from '@kbn/core-http-server';

interface DependencyInjectionProviderStart {
  transform(message: string): string;
}

export type ConsumeRequest = KibanaRequest<never, never, string>;

@injectable()
export class MessageTransformService {
  constructor(
    @inject(Request) private readonly request: ConsumeRequest,
    @inject(PluginStart<DependencyInjectionProviderStart>('dependencyInjectionProviderExample'))
    private readonly provider: DependencyInjectionProviderStart
  ) {}

  public transform() {
    const { body } = this.request;

    return {
      original: body,
      transformed: this.provider.transform(body),
    };
  }
}
