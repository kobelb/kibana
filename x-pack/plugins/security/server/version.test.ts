/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { VersionService, Version } from './version';

describe('#before', function() {
  test('0.0.1 is before 1.0.0', () => {
    const version = new VersionService('0.0.1');
    expect(version.before('1.0.0')).toBe(true);
  });

  test('7.7.0 is before "Version.V_8_0_0"', () => {
    const version = new VersionService('7.7.0');
    expect(version.before(Version.V_8_0_0)).toBe(true);
  });
});
