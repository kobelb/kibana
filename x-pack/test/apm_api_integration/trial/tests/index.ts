/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { FtrProviderContext } from '../../../api_integration/ftr_provider_context';

export default function observabilityApiIntegrationTests({ loadTestFile }: FtrProviderContext) {
  describe('APM specs (trial)', function () {
    this.tags('ciGroup1');

    describe('Services', function () {
      loadTestFile(require.resolve('./services/annotations'));
      loadTestFile(require.resolve('./services/rum_services.ts'));
    });

    describe('Service Maps', function () {
      loadTestFile(require.resolve('./service_maps/service_maps'));
    });
  });
}
