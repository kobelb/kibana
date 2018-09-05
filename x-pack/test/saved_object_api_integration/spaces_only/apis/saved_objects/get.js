/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { getTestSuiteFactory } from '../../../common/suites/saved_objects/get';
import { SPACES } from '../../../common/lib/spaces';

export default function ({ getService }) {
  const supertest = getService('supertest');
  const esArchiver = getService('esArchiver');

  const {
    createExpectDoesntExistNotFound,
    createExpectExistsNotFound,
    createExpectResults,
    getTest
  } = getTestSuiteFactory(esArchiver, supertest);

  describe('get', () => {
    getTest(`can access objects belonging to the current space (default)`, {
      ...SPACES.DEFAULT,
      tests: {
        exists: {
          statusCode: 200,
          response: createExpectResults(SPACES.DEFAULT.spaceId),
        },
        doesntExist: {
          statusCode: 404,
          response: createExpectDoesntExistNotFound(SPACES.DEFAULT.spaceId),
        }
      }
    });

    getTest(`cannot access objects belonging to a different space (default)`, {
      ...SPACES.DEFAULT,
      otherSpaceId: SPACES.SPACE_1.spaceId,
      tests: {
        exists: {
          statusCode: 404,
          response: createExpectExistsNotFound(SPACES.SPACE_1.spaceId)
        },
        doesntExist: {
          statusCode: 404,
          response: createExpectDoesntExistNotFound(SPACES.SPACE_1.spaceId),
        }
      }
    });

    getTest(`can access objects belonging to the current space (space_1)`, {
      ...SPACES.SPACE_1,
      tests: {
        exists: {
          statusCode: 200,
          response: createExpectResults(SPACES.SPACE_1.spaceId),
        },
        doesntExist: {
          statusCode: 404,
          response: createExpectDoesntExistNotFound(SPACES.SPACE_1.spaceId),
        }
      }
    });

    getTest(`cannot access objects belonging to a different space (space_1)`, {
      ...SPACES.SPACE_1,
      otherSpaceId: SPACES.SPACE_2.spaceId,
      tests: {
        exists: {
          statusCode: 404,
          response: createExpectExistsNotFound(SPACES.SPACE_2.spaceId)
        },
        doesntExist: {
          statusCode: 404,
          response: createExpectDoesntExistNotFound(SPACES.SPACE_2.spaceId),
        }
      }
    });
  });
}
