/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { AUTHENTICATION } from '../../../common/lib/authentication';
import { SPACES } from '../../../common/lib/spaces';
import { TestInvoker } from '../../../common/lib/types';
import { deleteTestSuiteFactory } from '../../../common/suites/spaces/delete';

// tslint:disable:no-default-export
export default function deleteSpaceTestSuite({ getService }: TestInvoker) {
  const supertestWithoutAuth = getService('supertestWithoutAuth');
  const esArchiver = getService('esArchiver');

  const {
    deleteTest,
    createExpectEmptyResult,
    createExpectReservedSpaceResult,
    createExpectNotFoundResult,
    createExpectForbiddenResult,
    createExpectLegacyForbiddenResult,
  } = deleteTestSuiteFactory(esArchiver, supertestWithoutAuth);

  describe('delete', () => {
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
      deleteTest(`${scenario.userWithAllGlobally.USERNAME} from the ${scenario.spaceId} space`, {
        spaceId: scenario.spaceId,
        auth: {
          username: scenario.userWithAllGlobally.USERNAME,
          password: scenario.userWithAllGlobally.PASSWORD,
        },
        tests: {
          exists: {
            statusCode: 204,
            response: createExpectEmptyResult(),
          },
          reservedSpace: {
            statusCode: 400,
            response: createExpectReservedSpaceResult(),
          },
          doesntExist: {
            statusCode: 404,
            response: createExpectNotFoundResult(),
          },
        },
      });

      deleteTest(`${scenario.userWithDualAll.USERNAME} from the ${scenario.spaceId} space`, {
        spaceId: scenario.spaceId,
        auth: {
          username: scenario.userWithDualAll.USERNAME,
          password: scenario.userWithDualAll.PASSWORD,
        },
        tests: {
          exists: {
            statusCode: 204,
            response: createExpectEmptyResult(),
          },
          reservedSpace: {
            statusCode: 400,
            response: createExpectReservedSpaceResult(),
          },
          doesntExist: {
            statusCode: 404,
            response: createExpectNotFoundResult(),
          },
        },
      });

      deleteTest(`${scenario.userWithLegacyAll.USERNAME} from the ${scenario.spaceId} space`, {
        spaceId: scenario.spaceId,
        auth: {
          username: scenario.userWithLegacyAll.USERNAME,
          password: scenario.userWithLegacyAll.PASSWORD,
        },
        tests: {
          exists: {
            statusCode: 204,
            response: createExpectEmptyResult(),
          },
          reservedSpace: {
            statusCode: 400,
            response: createExpectReservedSpaceResult(),
          },
          doesntExist: {
            statusCode: 404,
            response: createExpectNotFoundResult(),
          },
        },
      });

      deleteTest(`${scenario.userWithReadGlobally.USERNAME} from the ${scenario.spaceId} space`, {
        spaceId: scenario.spaceId,
        auth: {
          username: scenario.userWithReadGlobally.USERNAME,
          password: scenario.userWithReadGlobally.PASSWORD,
        },
        tests: {
          exists: {
            statusCode: 403,
            response: createExpectForbiddenResult(),
          },
          reservedSpace: {
            statusCode: 403,
            response: createExpectForbiddenResult(),
          },
          doesntExist: {
            statusCode: 403,
            response: createExpectForbiddenResult(),
          },
        },
      });

      deleteTest(`${scenario.userwithDualRead.USERNAME} from the ${scenario.spaceId} space`, {
        spaceId: scenario.spaceId,
        auth: {
          username: scenario.userwithDualRead.USERNAME,
          password: scenario.userwithDualRead.PASSWORD,
        },
        tests: {
          exists: {
            statusCode: 403,
            response: createExpectForbiddenResult(),
          },
          reservedSpace: {
            statusCode: 403,
            response: createExpectForbiddenResult(),
          },
          doesntExist: {
            statusCode: 403,
            response: createExpectForbiddenResult(),
          },
        },
      });

      deleteTest(`${scenario.userWithLegacyRead.USERNAME} from the ${scenario.spaceId} space`, {
        spaceId: scenario.spaceId,
        auth: {
          username: scenario.userWithLegacyRead.USERNAME,
          password: scenario.userWithLegacyRead.PASSWORD,
        },
        tests: {
          exists: {
            statusCode: 403,
            response: createExpectLegacyForbiddenResult(),
          },
          reservedSpace: {
            statusCode: 400,
            response: createExpectReservedSpaceResult(),
          },
          doesntExist: {
            statusCode: 404,
            response: createExpectNotFoundResult(),
          },
        },
      });

      deleteTest(`${scenario.userWithAllAtSpace} from the ${scenario.spaceId} space`, {
        spaceId: scenario.spaceId,
        auth: {
          username: scenario.userWithAllAtSpace.USERNAME,
          password: scenario.userWithAllAtSpace.PASSWORD,
        },
        tests: {
          exists: {
            statusCode: 403,
            response: createExpectForbiddenResult(),
          },
          reservedSpace: {
            statusCode: 403,
            response: createExpectForbiddenResult(),
          },
          doesntExist: {
            statusCode: 403,
            response: createExpectForbiddenResult(),
          },
        },
      });
    });
  });
}
