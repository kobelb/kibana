/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { SPACES } from '../../../common/lib/spaces';
import { findTestSuiteFactory } from '../../../common/suites/saved_objects/find';

export default function ({ getService }) {
  const supertest = getService('supertest');
  const esArchiver = getService('esArchiver');

  const {
    createExpectEmpty,
    createExpectResults,
    createExpectVisualizationResults,
    findTest,
  } = findTestSuiteFactory(esArchiver, supertest);

  describe('find', () => {

    findTest(`objects only within the current space (space_1)`, {
      ...SPACES.SPACE_1,
      tests: {
        normal: {
          description: 'only the visualization',
          statusCode: 200,
          response: createExpectVisualizationResults(SPACES.SPACE_1.spaceId),
        },
        unknownType: {
          description: 'empty result',
          statusCode: 200,
          response: createExpectEmpty(1, 20, 0),
        },
        pageBeyondTotal: {
          description: 'empty result',
          statusCode: 200,
          response: createExpectEmpty(100, 100, 1),
        },
        unknownSearchField: {
          description: 'empty result',
          statusCode: 200,
          response: createExpectEmpty(1, 20, 0),
        },
        noType: {
          description: 'all objects',
          statusCode: 200,
          response: createExpectResults(SPACES.SPACE_1.spaceId),
        },
      }
    });

    findTest(`objects only within the current space (default)`, {
      ...SPACES.DEFAULT,
      tests: {
        normal: {
          description: 'only the visualization',
          statusCode: 200,
          response: createExpectVisualizationResults(SPACES.DEFAULT.spaceId),
        },
        unknownType: {
          description: 'empty result',
          statusCode: 200,
          response: createExpectEmpty(1, 20, 0),
        },
        pageBeyondTotal: {
          description: 'empty result',
          statusCode: 200,
          response: createExpectEmpty(100, 100, 1),
        },
        unknownSearchField: {
          description: 'empty result',
          statusCode: 200,
          response: createExpectEmpty(1, 20, 0),
        },
        noType: {
          description: 'all objects',
          statusCode: 200,
          response: createExpectResults(SPACES.DEFAULT.spaceId),
        },
      }
    });
  });
}
