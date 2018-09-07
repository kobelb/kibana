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
        userWithAllAtSpace: AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_ALL_USER,
        userWithReadAtSpace: AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_READ_USER,
        userWithAllAtOtherSpace: AUTHENTICATION.KIBANA_RBAC_SPACE_1_ALL_USER,
      },
      {
        spaceId: SPACES.DEFAULT.spaceId,
        userWithAllAtSpace: AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_ALL_USER,
        userWithReadAtSpace: AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_READ_USER,
        userWithAllAtOtherSpace: AUTHENTICATION.KIBANA_RBAC_SPACE_1_ALL_USER,
      },
    ].forEach(({ spaceId, userWithAllAtSpace, userWithReadAtSpace, userWithAllAtOtherSpace }) => {
      deleteTest(AUTHENTICATION.NOT_A_KIBANA_USER.USERNAME, {
        auth: {
          username: AUTHENTICATION.NOT_A_KIBANA_USER.USERNAME,
          password: AUTHENTICATION.NOT_A_KIBANA_USER.PASSWORD,
        },
        spaceId,
        tests: {
          spaceAware: {
            statusCode: 403,
            response: createExpectLegacyForbidden(AUTHENTICATION.NOT_A_KIBANA_USER.USERNAME),
          },
          notSpaceAware: {
            statusCode: 403,
            response: createExpectLegacyForbidden(AUTHENTICATION.NOT_A_KIBANA_USER.USERNAME),
          },
          invalidId: {
            statusCode: 403,
            response: createExpectLegacyForbidden(AUTHENTICATION.NOT_A_KIBANA_USER.USERNAME),
          },
        },
      });

      deleteTest(AUTHENTICATION.SUPERUSER.USERNAME, {
        auth: {
          username: AUTHENTICATION.SUPERUSER.USERNAME,
          password: AUTHENTICATION.SUPERUSER.PASSWORD,
        },
        spaceId,
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
            response: createExpectUnknownDocNotFound(),
          },
        },
      });

      deleteTest(AUTHENTICATION.KIBANA_LEGACY_USER.USERNAME, {
        auth: {
          username: AUTHENTICATION.KIBANA_LEGACY_USER.USERNAME,
          password: AUTHENTICATION.KIBANA_LEGACY_USER.PASSWORD,
        },
        spaceId,
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
            response: createExpectUnknownDocNotFound(),
          },
        },
      });

      deleteTest(AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER.USERNAME, {
        auth: {
          username: AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER.USERNAME,
          password: AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER.PASSWORD,
        },
        spaceId,
        tests: {
          spaceAware: {
            statusCode: 403,
            response: createExpectLegacyForbidden(
              AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER.USERNAME
            ),
          },
          notSpaceAware: {
            statusCode: 403,
            response: createExpectLegacyForbidden(
              AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER.USERNAME
            ),
          },
          invalidId: {
            statusCode: 403,
            response: createExpectLegacyForbidden(
              AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER.USERNAME
            ),
          },
        },
      });

      deleteTest(AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_USER.USERNAME, {
        auth: {
          username: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_USER.USERNAME,
          password: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_USER.PASSWORD,
        },
        spaceId,
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
            response: createExpectUnknownDocNotFound(),
          },
        },
      });

      deleteTest(AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_DASHBOARD_ONLY_USER.USERNAME, {
        auth: {
          username: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_DASHBOARD_ONLY_USER.USERNAME,
          password: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_DASHBOARD_ONLY_USER.PASSWORD,
        },
        spaceId,
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

      deleteTest(AUTHENTICATION.KIBANA_RBAC_USER.USERNAME, {
        auth: {
          username: AUTHENTICATION.KIBANA_RBAC_USER.USERNAME,
          password: AUTHENTICATION.KIBANA_RBAC_USER.PASSWORD,
        },
        spaceId,
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
            response: createExpectUnknownDocNotFound(),
          },
        },
      });

      deleteTest(AUTHENTICATION.KIBANA_RBAC_DASHBOARD_ONLY_USER.USERNAME, {
        auth: {
          username: AUTHENTICATION.KIBANA_RBAC_DASHBOARD_ONLY_USER.USERNAME,
          password: AUTHENTICATION.KIBANA_RBAC_DASHBOARD_ONLY_USER.PASSWORD,
        },
        spaceId,
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

      deleteTest(userWithAllAtSpace.USERNAME, {
        auth: {
          username: userWithAllAtSpace.USERNAME,
          password: userWithAllAtSpace.PASSWORD,
        },
        spaceId,
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
            response: createExpectUnknownDocNotFound(),
          },
        },
      });

      deleteTest(userWithReadAtSpace.USERNAME, {
        auth: {
          username: userWithReadAtSpace.USERNAME,
          password: userWithReadAtSpace.PASSWORD,
        },
        spaceId,
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

      deleteTest(userWithAllAtOtherSpace.USERNAME, {
        auth: {
          username: userWithAllAtOtherSpace.USERNAME,
          password: userWithAllAtOtherSpace.PASSWORD,
        },
        spaceId,
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
    });
  });
}
