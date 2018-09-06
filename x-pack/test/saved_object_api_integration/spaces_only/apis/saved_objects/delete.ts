/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { SPACES } from '../../../common/lib/spaces';
import { TestInvoker } from '../../../common/lib/types';
import { deleteTestSuiteFactory } from '../../../common/suites/saved_objects/delete';

// tslint:disable:no-default-export
export default function({ getService }: TestInvoker) {
  const supertest = getService('supertest');
  const esArchiver = getService('esArchiver');

  describe('delete', () => {
    const { createExpectUnknownDocNotFound, deleteTest, expectEmpty } = deleteTestSuiteFactory(
      esArchiver,
      supertest
    );

    deleteTest(`in the default space`, {
      ...SPACES.DEFAULT,
      tests: {
        spaceAware: {
          statusCode: 200,
          response: expectEmpty,
        },
        notSpaceAware: {
          statusCode: 200,
          response: expectEmpty,
        },
        invalidId: {
          statusCode: 404,
          response: createExpectUnknownDocNotFound(SPACES.DEFAULT.spaceId),
        },
      },
    });

    deleteTest(`in the current space (space_1)`, {
      ...SPACES.SPACE_1,
      tests: {
        spaceAware: {
          statusCode: 200,
          response: expectEmpty,
        },
        notSpaceAware: {
          statusCode: 200,
          response: expectEmpty,
        },
        invalidId: {
          statusCode: 404,
          response: createExpectUnknownDocNotFound(SPACES.SPACE_1.spaceId),
        },
      },
    });
  });
}
