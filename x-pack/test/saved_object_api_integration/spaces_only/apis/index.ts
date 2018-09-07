/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { TestInvoker } from '../../common/lib/types';

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

// tslint:disable:no-default-export
export default function({ loadTestFile }: TestInvoker) {
  describe('apis spaces', () => {
    loadTestFile(require.resolve('./saved_objects'));
  });
}
