/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { AUTHENTICATION } from '../../common/lib/authentication';
import { SPACES } from '../../common/lib/spaces';
import { TestInvoker } from '../../common/lib/types';
import { deleteTestSuiteFactory } from '../../common/suites/delete';

// tslint:disable:no-default-export
export default function({ getService }: TestInvoker) {
  const supertest = getService('supertestWithoutAuth');
  const esArchiver = getService('esArchiver');

  describe('delete', () => {
    const {
      createExpectLegacyForbidden,
      createExpectUnknownDocNotFound,
      deleteTest,
      expectEmpty,
      expectRbacSpaceAwareForbidden,
      expectRbacNotSpaceAwareForbidden,
      expectRbacInvalidIdForbidden,
    } = deleteTestSuiteFactory(esArchiver, supertest);

    [
      {
        spaceId: SPACES.DEFAULT.spaceId,
        notAKibanaUser: AUTHENTICATION.NOT_A_KIBANA_USER,
        superuser: AUTHENTICATION.SUPERUSER,
        userWithLegacyAll: AUTHENTICATION.KIBANA_LEGACY_USER,
        userWithLegacyRead: AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER,
        userWithAllGlobally: AUTHENTICATION.KIBANA_RBAC_USER,
        userWithReadGlobally: AUTHENTICATION.KIBANA_RBAC_DASHBOARD_ONLY_USER,
        userWithDualAll: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_USER,
        userWithDualRead: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_DASHBOARD_ONLY_USER,
        userWithAllAtSpace: AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_ALL_USER,
        userWithReadAtSpace: AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_READ_USER,
        userWithAllAtOtherSpace: AUTHENTICATION.KIBANA_RBAC_SPACE_1_ALL_USER,
      },
      {
        spaceId: SPACES.SPACE_1.spaceId,
        notAKibanaUser: AUTHENTICATION.NOT_A_KIBANA_USER,
        superuser: AUTHENTICATION.SUPERUSER,
        userWithNoKibanaAccess: AUTHENTICATION.NOT_A_KIBANA_USER,
        userWithLegacyAll: AUTHENTICATION.KIBANA_LEGACY_USER,
        userWithLegacyRead: AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER,
        userWithAllGlobally: AUTHENTICATION.KIBANA_RBAC_USER,
        userWithReadGlobally: AUTHENTICATION.KIBANA_RBAC_DASHBOARD_ONLY_USER,
        userWithDualAll: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_USER,
        userWithDualRead: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_DASHBOARD_ONLY_USER,
        userWithAllAtSpace: AUTHENTICATION.KIBANA_RBAC_SPACE_1_ALL_USER,
        userWithReadAtSpace: AUTHENTICATION.KIBANA_RBAC_SPACE_1_READ_USER,
        userWithAllAtOtherSpace: AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_ALL_USER,
      },
    ].forEach(scenario => {
      deleteTest(`${scenario.notAKibanaUser.USERNAME} within the ${scenario.spaceId} space`, {
        auth: {
          username: scenario.notAKibanaUser.USERNAME,
          password: scenario.notAKibanaUser.PASSWORD,
        },
        spaceId: scenario.spaceId,
        tests: {
          spaceAware: {
            statusCode: 403,
            response: createExpectLegacyForbidden(scenario.notAKibanaUser.USERNAME),
          },
          notSpaceAware: {
            statusCode: 403,
            response: createExpectLegacyForbidden(scenario.notAKibanaUser.USERNAME),
          },
          invalidId: {
            statusCode: 403,
            response: createExpectLegacyForbidden(scenario.notAKibanaUser.USERNAME),
          },
        },
      });

      deleteTest(`${scenario.superuser.USERNAME} within the ${scenario.spaceId} space`, {
        auth: {
          username: scenario.superuser.USERNAME,
          password: scenario.superuser.PASSWORD,
        },
        spaceId: scenario.spaceId,
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
            response: createExpectUnknownDocNotFound(scenario.spaceId),
          },
        },
      });

      deleteTest(`${scenario.userWithLegacyAll.USERNAME} within the ${scenario.spaceId} space`, {
        auth: {
          username: scenario.userWithLegacyAll.USERNAME,
          password: scenario.userWithLegacyAll.PASSWORD,
        },
        spaceId: scenario.spaceId,
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
            response: createExpectUnknownDocNotFound(scenario.spaceId),
          },
        },
      });

      deleteTest(`${scenario.userWithLegacyRead.USERNAME} within the ${scenario.spaceId} space`, {
        auth: {
          username: scenario.userWithLegacyRead.USERNAME,
          password: scenario.userWithLegacyRead.PASSWORD,
        },
        spaceId: scenario.spaceId,
        tests: {
          spaceAware: {
            statusCode: 403,
            response: createExpectLegacyForbidden(scenario.userWithLegacyRead.USERNAME),
          },
          notSpaceAware: {
            statusCode: 403,
            response: createExpectLegacyForbidden(scenario.userWithLegacyRead.USERNAME),
          },
          invalidId: {
            statusCode: 403,
            response: createExpectLegacyForbidden(scenario.userWithLegacyRead.USERNAME),
          },
        },
      });

      deleteTest(`${scenario.userWithDualAll.USERNAME} within the ${scenario.spaceId} space`, {
        auth: {
          username: scenario.userWithDualAll.USERNAME,
          password: scenario.userWithDualAll.PASSWORD,
        },
        spaceId: scenario.spaceId,
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
            response: createExpectUnknownDocNotFound(scenario.spaceId),
          },
        },
      });

      deleteTest(`${scenario.userWithDualRead.USERNAME} within the ${scenario.spaceId} space`, {
        auth: {
          username: scenario.userWithDualRead.USERNAME,
          password: scenario.userWithDualRead.PASSWORD,
        },
        spaceId: scenario.spaceId,
        tests: {
          spaceAware: {
            statusCode: 403,
            response: expectRbacSpaceAwareForbidden,
          },
          notSpaceAware: {
            statusCode: 403,
            response: expectRbacNotSpaceAwareForbidden,
          },
          invalidId: {
            statusCode: 403,
            response: expectRbacInvalidIdForbidden,
          },
        },
      });

      deleteTest(`${scenario.userWithAllGlobally.USERNAME} within the ${scenario.spaceId} space`, {
        auth: {
          username: scenario.userWithAllGlobally.USERNAME,
          password: scenario.userWithAllGlobally.PASSWORD,
        },
        spaceId: scenario.spaceId,
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
            response: createExpectUnknownDocNotFound(scenario.spaceId),
          },
        },
      });

      deleteTest(`${scenario.userWithReadGlobally.USERNAME} within the ${scenario.spaceId} space`, {
        auth: {
          username: scenario.userWithReadGlobally.USERNAME,
          password: scenario.userWithReadGlobally.PASSWORD,
        },
        spaceId: scenario.spaceId,
        tests: {
          spaceAware: {
            statusCode: 403,
            response: expectRbacSpaceAwareForbidden,
          },
          notSpaceAware: {
            statusCode: 403,
            response: expectRbacNotSpaceAwareForbidden,
          },
          invalidId: {
            statusCode: 403,
            response: expectRbacInvalidIdForbidden,
          },
        },
      });

      deleteTest(`${scenario.userWithAllAtSpace.USERNAME} within the ${scenario.spaceId} space`, {
        auth: {
          username: scenario.userWithAllAtSpace.USERNAME,
          password: scenario.userWithAllAtSpace.PASSWORD,
        },
        spaceId: scenario.spaceId,
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
            response: createExpectUnknownDocNotFound(scenario.spaceId),
          },
        },
      });

      deleteTest(`${scenario.userWithReadAtSpace.USERNAME} within the ${scenario.spaceId} space`, {
        auth: {
          username: scenario.userWithReadAtSpace.USERNAME,
          password: scenario.userWithReadAtSpace.PASSWORD,
        },
        spaceId: scenario.spaceId,
        tests: {
          spaceAware: {
            statusCode: 403,
            response: expectRbacSpaceAwareForbidden,
          },
          notSpaceAware: {
            statusCode: 403,
            response: expectRbacNotSpaceAwareForbidden,
          },
          invalidId: {
            statusCode: 403,
            response: expectRbacInvalidIdForbidden,
          },
        },
      });

      deleteTest(
        `${scenario.userWithAllAtOtherSpace.USERNAME} within the ${scenario.spaceId} space`,
        {
          auth: {
            username: scenario.userWithAllAtOtherSpace.USERNAME,
            password: scenario.userWithAllAtOtherSpace.PASSWORD,
          },
          spaceId: scenario.spaceId,
          tests: {
            spaceAware: {
              statusCode: 403,
              response: expectRbacSpaceAwareForbidden,
            },
            notSpaceAware: {
              statusCode: 403,
              response: expectRbacNotSpaceAwareForbidden,
            },
            invalidId: {
              statusCode: 403,
              response: expectRbacInvalidIdForbidden,
            },
          },
        }
      );
    });
  });
}
