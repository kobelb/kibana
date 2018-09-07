/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { AUTHENTICATION } from '../../../common/lib/authentication';
import { SPACES } from '../../../common/lib/spaces';
import { TestInvoker } from '../../../common/lib/types';
import { updateTestSuiteFactory } from '../../../common/suites/spaces/update';

// tslint:disable:no-default-export
export default function updateSpaceTestSuite({ getService }: TestInvoker) {
  const supertestWithoutAuth = getService('supertestWithoutAuth');
  const esArchiver = getService('esArchiver');

  const {
    updateTest,
    createExpectResult,
    createExpectNotFoundResult,
    createExpectForbiddenResult,
    createExpectLegacyForbiddenResult,
  } = updateTestSuiteFactory(esArchiver, supertestWithoutAuth);

  describe('update', () => {
    [
      {
        spaceId: SPACES.DEFAULT.spaceId,
        userWithAllGlobally: AUTHENTICATION.KIBANA_RBAC_USER,
        userWithReadGlobally: AUTHENTICATION.KIBANA_RBAC_DASHBOARD_ONLY_USER,
        userWithAllAtSpace: AUTHENTICATION.KIBANA_RBAC_SPACE_1_ALL_USER,
        userWithReadAtSpace: AUTHENTICATION.KIBANA_RBAC_SPACE_1_READ_USER,
        userWithLegacyAll: AUTHENTICATION.KIBANA_LEGACY_USER,
        userWithLegacyRead: AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER,
        userWithDualAll: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_USER,
        userWithDualRead: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_DASHBOARD_ONLY_USER,
      },
      {
        spaceId: SPACES.SPACE_1.spaceId,
        userWithAllGlobally: AUTHENTICATION.KIBANA_RBAC_USER,
        userWithReadGlobally: AUTHENTICATION.KIBANA_RBAC_DASHBOARD_ONLY_USER,
        userWithAllAtSpace: AUTHENTICATION.KIBANA_RBAC_SPACE_1_ALL_USER,
        userWithReadAtSpace: AUTHENTICATION.KIBANA_RBAC_SPACE_1_READ_USER,
        userWithLegacyAll: AUTHENTICATION.KIBANA_LEGACY_USER,
        userWithLegacyRead: AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER,
        userWithDualAll: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_USER,
        userWithDualRead: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_DASHBOARD_ONLY_USER,
      },
    ].forEach(scenario => {
      updateTest(
        `${scenario.userWithAllGlobally.USERNAME} can update space_1 from 
        the ${scenario.spaceId} space`,
        {
          spaceId: scenario.spaceId,
          auth: {
            username: scenario.userWithAllGlobally.USERNAME,
            password: scenario.userWithAllGlobally.PASSWORD,
          },
          tests: {
            alreadyExists: {
              space: {
                name: 'space 1',
                id: 'space_1',
                description: 'a description',
                color: '#5c5959',
                _reserved: true,
              },
              statusCode: 200,
              response: createExpectResult({
                name: 'space 1',
                id: 'space_1',
                description: 'a description',
                color: '#5c5959',
              }),
            },
            newSpace: {
              space: {
                name: 'marketing',
                id: 'marketing',
                description: 'a description',
                color: '#5c5959',
              },
              statusCode: 404,
              response: createExpectNotFoundResult('marketing'),
            },
          },
        }
      );

      updateTest(
        `${scenario.userWithDualAll.USERNAME} can update space_1 from 
        the ${scenario.spaceId} space`,
        {
          spaceId: scenario.spaceId,
          auth: {
            username: scenario.userWithDualAll.USERNAME,
            password: scenario.userWithDualAll.PASSWORD,
          },
          tests: {
            alreadyExists: {
              space: {
                name: 'space 1',
                id: 'space_1',
                description: 'a description',
                color: '#5c5959',
                _reserved: true,
              },
              statusCode: 200,
              response: createExpectResult({
                name: 'space 1',
                id: 'space_1',
                description: 'a description',
                color: '#5c5959',
              }),
            },
            newSpace: {
              space: {
                name: 'marketing',
                id: 'marketing',
                description: 'a description',
                color: '#5c5959',
              },
              statusCode: 404,
              response: createExpectNotFoundResult('marketing'),
            },
          },
        }
      );

      updateTest(
        `${scenario.userWithLegacyAll.USERNAME} can update space_1 from 
        the ${scenario.spaceId} space`,
        {
          spaceId: scenario.spaceId,
          auth: {
            username: scenario.userWithLegacyAll.USERNAME,
            password: scenario.userWithLegacyAll.PASSWORD,
          },
          tests: {
            alreadyExists: {
              space: {
                name: 'space 1',
                id: 'space_1',
                description: 'a description',
                color: '#5c5959',
                _reserved: true,
              },
              statusCode: 200,
              response: createExpectResult({
                name: 'space 1',
                id: 'space_1',
                description: 'a description',
                color: '#5c5959',
              }),
            },
            newSpace: {
              space: {
                name: 'marketing',
                id: 'marketing',
                description: 'a description',
                color: '#5c5959',
              },
              statusCode: 404,
              response: createExpectNotFoundResult('marketing'),
            },
          },
        }
      );

      updateTest(
        `${scenario.userWithReadGlobally.USERNAME} cannot update space_1 
        from the ${scenario.spaceId} space`,
        {
          spaceId: scenario.spaceId,
          auth: {
            username: scenario.userWithReadGlobally.USERNAME,
            password: scenario.userWithReadGlobally.PASSWORD,
          },
          tests: {
            alreadyExists: {
              space: {
                name: 'space 1',
                id: 'space_1',
                description: 'a description',
                color: '#5c5959',
                _reserved: true,
              },
              statusCode: 403,
              response: createExpectForbiddenResult(),
            },
            newSpace: {
              space: {
                name: 'marketing',
                id: 'marketing',
                description: 'a description',
                color: '#5c5959',
              },
              statusCode: 403,
              response: createExpectForbiddenResult(),
            },
          },
        }
      );

      updateTest(
        `${scenario.userWithDualRead.USERNAME} cannot update space_1 
        from the ${scenario.spaceId} space`,
        {
          spaceId: scenario.spaceId,
          auth: {
            username: scenario.userWithDualRead.USERNAME,
            password: scenario.userWithDualRead.PASSWORD,
          },
          tests: {
            alreadyExists: {
              space: {
                name: 'space 1',
                id: 'space_1',
                description: 'a description',
                color: '#5c5959',
                _reserved: true,
              },
              statusCode: 403,
              response: createExpectForbiddenResult(),
            },
            newSpace: {
              space: {
                name: 'marketing',
                id: 'marketing',
                description: 'a description',
                color: '#5c5959',
              },
              statusCode: 403,
              response: createExpectForbiddenResult(),
            },
          },
        }
      );

      updateTest(
        `${scenario.userWithLegacyRead.USERNAME} cannot update space_1 
        from the ${scenario.spaceId} space`,
        {
          spaceId: scenario.spaceId,
          auth: {
            username: scenario.userWithLegacyRead.USERNAME,
            password: scenario.userWithLegacyRead.PASSWORD,
          },
          tests: {
            alreadyExists: {
              space: {
                name: 'space 1',
                id: 'space_1',
                description: 'a description',
                color: '#5c5959',
                _reserved: true,
              },
              statusCode: 403,
              response: createExpectLegacyForbiddenResult(),
            },
            newSpace: {
              space: {
                name: 'marketing',
                id: 'marketing',
                description: 'a description',
                color: '#5c5959',
              },
              statusCode: 403,
              response: createExpectLegacyForbiddenResult(),
            },
          },
        }
      );

      updateTest(`${scenario.userWithAllAtSpace.USERNAME} cannot update space_1`, {
        spaceId: scenario.spaceId,
        auth: {
          username: scenario.userWithAllAtSpace.USERNAME,
          password: scenario.userWithAllAtSpace.PASSWORD,
        },
        tests: {
          alreadyExists: {
            space: {
              name: 'space 1',
              id: 'space_1',
              description: 'a description',
              color: '#5c5959',
              _reserved: true,
            },
            statusCode: 403,
            response: createExpectForbiddenResult(),
          },
          newSpace: {
            space: {
              name: 'marketing',
              id: 'marketing',
              description: 'a description',
              color: '#5c5959',
            },
            statusCode: 403,
            response: createExpectForbiddenResult(),
          },
        },
      });

      updateTest(`${scenario.userWithReadAtSpace.USERNAME} cannot update space_1`, {
        spaceId: scenario.spaceId,
        auth: {
          username: scenario.userWithReadAtSpace.USERNAME,
          password: scenario.userWithReadAtSpace.PASSWORD,
        },
        tests: {
          alreadyExists: {
            space: {
              name: 'space 1',
              id: 'space_1',
              description: 'a description',
              color: '#5c5959',
              _reserved: true,
            },
            statusCode: 403,
            response: createExpectForbiddenResult(),
          },
          newSpace: {
            space: {
              name: 'marketing',
              id: 'marketing',
              description: 'a description',
              color: '#5c5959',
            },
            statusCode: 403,
            response: createExpectForbiddenResult(),
          },
        },
      });
    });
  });
}
