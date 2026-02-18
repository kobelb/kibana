/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { injectable, inject } from 'inversify';
import { schema } from '@kbn/config-schema';
import { Response } from '@kbn/core-di-server';
import type { KibanaResponseFactory } from '@kbn/core-http-server';
import { MessageTransformService } from './message_transform_service';

@injectable()
export class ConsumerRoute {
  static method = 'post' as const;
  static path = '/api/di/consumer/transform';
  static validate = {
    body: schema.string(),
  };
  static options = {
    xsrfRequired: false,
    access: 'public' as const,
  };
  static security = {
    authz: {
      enabled: false,
      reason: 'This route is opted out of authorization as it is a developer example endpoint.',
    },
  } as const;

  constructor(
    @inject(MessageTransformService) private readonly transformService: MessageTransformService,
    @inject(Response) private readonly response: KibanaResponseFactory
  ) {}

  public handle() {
    return this.response.ok({
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(this.transformService.transform()),
    });
  }
}
