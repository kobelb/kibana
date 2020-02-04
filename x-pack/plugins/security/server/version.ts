/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import semver from 'semver';

export enum Version {
  V_7_7_0 = '7.7.0',
  V_8_0_0 = '8.0.0',
}

export class VersionService {
  constructor(private readonly currentVersion: string) {}

  before(version: string) {
    return semver.lt(this.currentVersion, version);
  }
}
