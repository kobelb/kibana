/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { beforeSecurityTestSetup } from './lib/security_test_setup';
export default function ({ loadTestFile, getService, }) {
  const es = getService('es');
  const supertest = getService('supertest');

  describe('apis spaces_with_security', () => {
    before(async () => beforeSecurityTestSetup(es, supertest));

    loadTestFile(require.resolve('./es'));
    loadTestFile(require.resolve('./privileges'));
    loadTestFile(require.resolve('./saved_objects'));
  });
}
