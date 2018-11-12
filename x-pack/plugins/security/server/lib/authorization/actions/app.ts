/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { isString } from 'lodash';

export class AppActions {
  public get(appId: string) {
    if (!appId || !isString(appId)) {
      throw new Error('appId is required and must be a string');
    }

    return `app:${appId}`;
  }
}
