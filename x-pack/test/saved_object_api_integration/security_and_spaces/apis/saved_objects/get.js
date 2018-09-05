/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { AUTHENTICATION } from '../../../common/lib/authentication';
import { getTestSuiteFactory } from '../../../common/suites/saved_objects/get';
import { SPACES } from '../../../common/lib/spaces';

export default function ({ getService }) {
  const supertest = getService('supertestWithoutAuth');
  const esArchiver = getService('esArchiver');

  const {
    createExpectDoesntExistNotFound,
    createExpectLegacyForbidden,
    createExpectRbacForbidden,
    createExpectResults,
    getTest
  } = getTestSuiteFactory(esArchiver, supertest);

  describe('get', () => {
    [
      {
        spaceId: SPACES.DEFAULT.spaceId,
        userWithAllAtSpace: AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_ALL_USER,
        userWithReadAtSpace: AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_READ_USER,
        userWithAllAtOtherSpace: AUTHENTICATION.KIBANA_RBAC_SPACE_1_ALL_USER,
      },
      {
        spaceId: SPACES.SPACE_1.spaceId,
        userWithAllAtSpace: AUTHENTICATION.KIBANA_RBAC_SPACE_1_ALL_USER,
        userWithReadAtSpace: AUTHENTICATION.KIBANA_RBAC_SPACE_1_READ_USER,
        userWithAllAtOtherSpace: AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_ALL_USER,
      }
    ].forEach(({
      spaceId,
      userWithAllAtSpace,
      userWithReadAtSpace,
      userWithAllAtOtherSpace,
    }) => {
      getTest(AUTHENTICATION.NOT_A_KIBANA_USER.USERNAME, {
        auth: {
          username: AUTHENTICATION.NOT_A_KIBANA_USER.USERNAME,
          password: AUTHENTICATION.NOT_A_KIBANA_USER.PASSWORD,
        },
        spaceId,
        tests: {
          exists: {
            statusCode: 403,
            response: createExpectLegacyForbidden(AUTHENTICATION.NOT_A_KIBANA_USER.USERNAME),
          },
          doesntExist: {
            statusCode: 403,
            response: createExpectLegacyForbidden(AUTHENTICATION.NOT_A_KIBANA_USER.USERNAME),
          },
        }
      });


      getTest(AUTHENTICATION.SUPERUSER.USERNAME, {
        auth: {
          username: AUTHENTICATION.SUPERUSER.USERNAME,
          password: AUTHENTICATION.SUPERUSER.PASSWORD,
        },
        spaceId,
        tests: {
          exists: {
            statusCode: 200,
            response: createExpectResults(spaceId),
          },
          doesntExist: {
            statusCode: 404,
            response: createExpectDoesntExistNotFound(spaceId),
          },
        }
      });

      getTest(AUTHENTICATION.KIBANA_LEGACY_USER.USERNAME, {
        auth: {
          username: AUTHENTICATION.KIBANA_LEGACY_USER.USERNAME,
          password: AUTHENTICATION.KIBANA_LEGACY_USER.PASSWORD,
        },
        spaceId,
        tests: {
          exists: {
            statusCode: 200,
            response: createExpectResults(spaceId),
          },
          doesntExist: {
            statusCode: 404,
            response: createExpectDoesntExistNotFound(spaceId),
          },
        }
      });

      getTest(AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER.USERNAME, {
        auth: {
          username: AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER.USERNAME,
          password: AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER.PASSWORD,
        },
        spaceId,
        tests: {
          exists: {
            statusCode: 200,
            response: createExpectResults(spaceId),
          },
          doesntExist: {
            statusCode: 404,
            response: createExpectDoesntExistNotFound(spaceId),
          },
        }
      });

      getTest(AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_USER.USERNAME, {
        auth: {
          username: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_USER.USERNAME,
          password: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_USER.PASSWORD,
        },
        spaceId,
        tests: {
          exists: {
            statusCode: 200,
            response: createExpectResults(spaceId),
          },
          doesntExist: {
            statusCode: 404,
            response: createExpectDoesntExistNotFound(spaceId),
          },
        }
      });

      getTest(AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_DASHBOARD_ONLY_USER.USERNAME, {
        auth: {
          username: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_DASHBOARD_ONLY_USER.USERNAME,
          password: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_DASHBOARD_ONLY_USER.PASSWORD,
        },
        spaceId,
        tests: {
          exists: {
            statusCode: 200,
            response: createExpectResults(spaceId),
          },
          doesntExist: {
            statusCode: 404,
            response: createExpectDoesntExistNotFound(spaceId),
          },
        }
      });

      getTest(AUTHENTICATION.KIBANA_RBAC_USER.USERNAME, {
        auth: {
          username: AUTHENTICATION.KIBANA_RBAC_USER.USERNAME,
          password: AUTHENTICATION.KIBANA_RBAC_USER.PASSWORD,
        },
        spaceId,
        tests: {
          exists: {
            statusCode: 200,
            response: createExpectResults(spaceId),
          },
          doesntExist: {
            statusCode: 404,
            response: createExpectDoesntExistNotFound(spaceId),
          },
        }
      });

      getTest(AUTHENTICATION.KIBANA_RBAC_DASHBOARD_ONLY_USER.USERNAME, {
        auth: {
          username: AUTHENTICATION.KIBANA_RBAC_DASHBOARD_ONLY_USER.USERNAME,
          password: AUTHENTICATION.KIBANA_RBAC_DASHBOARD_ONLY_USER.PASSWORD,
        },
        spaceId,
        tests: {
          exists: {
            statusCode: 200,
            response: createExpectResults(spaceId),
          },
          doesntExist: {
            statusCode: 404,
            response: createExpectDoesntExistNotFound(spaceId),
          },
        }
      });

      getTest(`${userWithAllAtSpace.USERNAME} user`, {
        auth: {
          username: userWithAllAtSpace.USERNAME,
          password: userWithAllAtSpace.PASSWORD,
        },
        spaceId,
        tests: {
          exists: {
            statusCode: 200,
            response: createExpectResults(spaceId),
          },
          doesntExist: {
            statusCode: 404,
            response: createExpectDoesntExistNotFound(spaceId),
          },
        }
      });

      getTest(`${userWithReadAtSpace.USERNAME} user`, {
        auth: {
          username: userWithReadAtSpace.USERNAME,
          password: userWithReadAtSpace.PASSWORD,
        },
        spaceId,
        tests: {
          exists: {
            statusCode: 200,
            response: createExpectResults(spaceId),
          },
          doesntExist: {
            statusCode: 404,
            response: createExpectDoesntExistNotFound(spaceId),
          },
        }
      });

      getTest(`${userWithAllAtOtherSpace.USERNAME} user`, {
        auth: {
          username: userWithAllAtOtherSpace.USERNAME,
          password: userWithAllAtOtherSpace.PASSWORD,
        },
        spaceId,
        tests: {
          exists: {
            statusCode: 403,
            response: createExpectRbacForbidden(),
          },
          doesntExist: {
            statusCode: 403,
            response: createExpectRbacForbidden(),
          },
        }
      });
    });
  });
}
