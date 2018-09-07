/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { AUTHENTICATION } from '../../../common/lib/authentication';
import { SPACES } from '../../../common/lib/spaces';
import { TestInvoker } from '../../../common/lib/types';
import { createTestSuiteFactory } from '../../../common/suites/spaces/create';

// tslint:disable:no-default-export
export default function createSpacesOnlySuite({ getService }: TestInvoker) {
  const supertestWithoutAuth = getService('supertestWithoutAuth');
  const esArchiver = getService('esArchiver');

  const {
    createTest,
    createExpectResult,
    createExpectConflictResponse,
    createExpectForbiddenResponse,
    createExpectLegacyForbiddenResponse,
  } = createTestSuiteFactory(esArchiver, supertestWithoutAuth);

  describe('create', () => {
    [
      {
        spaceId: SPACES.DEFAULT.spaceId,
        userWithAllGlobally: AUTHENTICATION.KIBANA_RBAC_USER,
        userWithReadGlobally: AUTHENTICATION.KIBANA_RBAC_DASHBOARD_ONLY_USER,
        userWithAllAtSpace: AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_ALL_USER,
        userWithLegacyAll: AUTHENTICATION.KIBANA_LEGACY_USER,
        userWithLegacyRead: AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER,
        userWithDualAll: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_USER,
        userwithDualRead: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_DASHBOARD_ONLY_USER,
      },
      {
        spaceId: SPACES.SPACE_1.spaceId,
        userWithAllGlobally: AUTHENTICATION.KIBANA_RBAC_USER,
        userWithReadGlobally: AUTHENTICATION.KIBANA_RBAC_DASHBOARD_ONLY_USER,
        userWithAllAtSpace: AUTHENTICATION.KIBANA_RBAC_SPACE_1_ALL_USER,
        userWithLegacyAll: AUTHENTICATION.KIBANA_LEGACY_USER,
        userWithLegacyRead: AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER,
        userWithDualAll: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_USER,
        userwithDualRead: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_DASHBOARD_ONLY_USER,
      },
    ].forEach(scenario => {
      createTest(`${scenario.userWithAllGlobally.USERNAME} within the ${scenario.spaceId} space`, {
        spaceId: scenario.spaceId,
        auth: {
          username: scenario.userWithAllGlobally.USERNAME,
          password: scenario.userWithAllGlobally.PASSWORD,
        },
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
            response: createExpectConflictResponse(),
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

      createTest(`${scenario.userWithDualAll.USERNAME} within the ${scenario.spaceId} space`, {
        spaceId: scenario.spaceId,
        auth: {
          username: scenario.userWithDualAll.USERNAME,
          password: scenario.userWithDualAll.PASSWORD,
        },
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
            response: createExpectConflictResponse(),
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

      createTest(`${scenario.userWithLegacyAll.USERNAME} within the ${scenario.spaceId} space`, {
        spaceId: scenario.spaceId,
        auth: {
          username: scenario.userWithLegacyAll.USERNAME,
          password: scenario.userWithLegacyAll.PASSWORD,
        },
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
            response: createExpectConflictResponse(),
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

      createTest(`${scenario.userWithReadGlobally.USERNAME} within the ${scenario.spaceId} space`, {
        spaceId: scenario.spaceId,
        auth: {
          username: scenario.userWithReadGlobally.USERNAME,
          password: scenario.userWithReadGlobally.PASSWORD,
        },
        tests: {
          newSpace: {
            space: {
              name: 'marketing',
              id: 'marketing',
              description: 'a description',
              color: '#5c5959',
            },
            statusCode: 403,
            response: createExpectForbiddenResponse(),
          },
          alreadyExists: {
            statusCode: 403,
            response: createExpectForbiddenResponse(),
          },
          reservedSpecified: {
            space: {
              name: 'reserved space',
              id: 'reserved',
              description: 'a description',
              color: '#5c5959',
              _reserved: true,
            },
            statusCode: 403,
            response: createExpectForbiddenResponse(),
          },
        },
      });

      createTest(`${scenario.userwithDualRead.USERNAME} within the ${scenario.spaceId} space`, {
        spaceId: scenario.spaceId,
        auth: {
          username: scenario.userwithDualRead.USERNAME,
          password: scenario.userwithDualRead.PASSWORD,
        },
        tests: {
          newSpace: {
            space: {
              name: 'marketing',
              id: 'marketing',
              description: 'a description',
              color: '#5c5959',
            },
            statusCode: 403,
            response: createExpectForbiddenResponse(),
          },
          alreadyExists: {
            statusCode: 403,
            response: createExpectForbiddenResponse(),
          },
          reservedSpecified: {
            space: {
              name: 'reserved space',
              id: 'reserved',
              description: 'a description',
              color: '#5c5959',
              _reserved: true,
            },
            statusCode: 403,
            response: createExpectForbiddenResponse(),
          },
        },
      });

      createTest(`${scenario.userWithLegacyRead.USERNAME} within the ${scenario.spaceId} space`, {
        spaceId: scenario.spaceId,
        auth: {
          username: scenario.userWithLegacyRead.USERNAME,
          password: scenario.userWithLegacyRead.PASSWORD,
        },
        tests: {
          newSpace: {
            space: {
              name: 'marketing',
              id: 'marketing',
              description: 'a description',
              color: '#5c5959',
            },
            statusCode: 403,
            response: createExpectLegacyForbiddenResponse(),
          },
          alreadyExists: {
            statusCode: 403,
            response: createExpectLegacyForbiddenResponse(),
          },
          reservedSpecified: {
            space: {
              name: 'reserved space',
              id: 'reserved',
              description: 'a description',
              color: '#5c5959',
              _reserved: true,
            },
            statusCode: 403,
            response: createExpectLegacyForbiddenResponse(),
          },
        },
      });

      createTest(`${scenario.userWithAllAtSpace.USERNAME} within the ${scenario.spaceId} space`, {
        spaceId: scenario.spaceId,
        auth: {
          username: scenario.userWithAllAtSpace.USERNAME,
          password: scenario.userWithAllAtSpace.PASSWORD,
        },
        tests: {
          newSpace: {
            space: {
              name: 'marketing',
              id: 'marketing',
              description: 'a description',
              color: '#5c5959',
            },
            statusCode: 403,
            response: createExpectForbiddenResponse(),
          },
          alreadyExists: {
            statusCode: 403,
            response: createExpectForbiddenResponse(),
          },
          reservedSpecified: {
            space: {
              name: 'reserved space',
              id: 'reserved',
              description: 'a description',
              color: '#5c5959',
              _reserved: true,
            },
            statusCode: 403,
            response: createExpectForbiddenResponse(),
          },
        },
      });
    });
  });
}
