/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { SPACES } from '../../common/lib/spaces';
import { TestInvoker } from '../../common/lib/types';
import { createTestSuiteFactory } from '../../common/suites/create';

// tslint:disable:no-default-export
export default function createSpacesOnlySuite({ getService }: TestInvoker) {
  const supertestWithoutAuth = getService('supertestWithoutAuth');
  const esArchiver = getService('esArchiver');

  const { createTest, createExpectResult, expectConflictResponse } = createTestSuiteFactory(
    esArchiver,
    supertestWithoutAuth
  );

  describe('create', () => {
    [
      {
        spaceId: SPACES.DEFAULT.spaceId,
      },
      {
        spaceId: SPACES.SPACE_1.spaceId,
      },
    ].forEach(scenario => {
      createTest(`from the ${scenario.spaceId} space`, {
        spaceId: scenario.spaceId,
        tests: {
          newSpace: {
            space: {
              name: 'marketing',
              id: 'marketing',
              description: 'a description',
              color: '#5c5959',
            },
            statusCode: 200,
            response: createExpectResult({
              name: 'marketing',
              id: 'marketing',
              description: 'a description',
              color: '#5c5959',
            }),
          },
          alreadyExists: {
            statusCode: 409,
            response: expectConflictResponse,
          },
          reservedSpecified: {
            space: {
              name: 'reserved space',
              id: 'reserved',
              description: 'a description',
              color: '#5c5959',
              _reserved: true,
            },
            statusCode: 200,
            response: createExpectResult({
              name: 'reserved space',
              id: 'reserved',
              description: 'a description',
              color: '#5c5959',
            }),
          },
        },
      });
    });
  });
}
