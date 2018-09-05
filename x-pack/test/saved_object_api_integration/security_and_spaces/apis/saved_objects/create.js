/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import expect from 'expect.js';
import { AUTHENTICATION } from '../../../common/lib/authentication';
import { createTestSuiteFactory } from '../../../common/suites/saved_objects/create';
import { SPACES } from '../../../common/lib/spaces';

export default function ({ getService }) {
  const supertestWithoutAuth = getService('supertestWithoutAuth');
  const es = getService('es');
  const esArchiver = getService('esArchiver');

  const {
    createTest,
    createExpectSpaceAwareResults,
    expectNotSpaceAwareResults,
    notSpaceAwareType,
    spaceAwareType,
  } = createTestSuiteFactory(es, esArchiver, supertestWithoutAuth);

  describe('create', () => {

    const createExpectRbacForbidden = type => resp => {
      expect(resp.body).to.eql({
        statusCode: 403,
        error: 'Forbidden',
        message: `Unable to create ${type}, missing action:saved_objects/${type}/create`
      });
    };

    const createExpectLegacyForbidden = username => resp => {
      expect(resp.body).to.eql({
        statusCode: 403,
        error: 'Forbidden',
        //eslint-disable-next-line max-len
        message: `action [indices:data/write/index] is unauthorized for user [${username}]: [security_exception] action [indices:data/write/index] is unauthorized for user [${username}]`
      });
    };

    [{
      spaceId: SPACES.DEFAULT.spaceId,
      userWithAllAtSpace: AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_ALL_USER,
      userWithReadAtSpace: AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_READ_USER,
      userWithAllAtOtherSpace: AUTHENTICATION.KIBANA_RBAC_SPACE_1_ALL_USER,
    }, {
      spaceId: SPACES.DEFAULT.spaceId,
      userWithAllAtSpace: AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_ALL_USER,
      userWithReadAtSpace: AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_READ_USER,
      userWithAllAtOtherSpace: AUTHENTICATION.KIBANA_RBAC_SPACE_1_ALL_USER,
    }].forEach(({
      spaceId,
      userWithAllAtSpace,
      userWithReadAtSpace,
      userWithAllAtOtherSpace
    }) => {
      createTest(AUTHENTICATION.NOT_A_KIBANA_USER.USERNAME, {
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
        }
      });

      createTest(AUTHENTICATION.SUPERUSER.USERNAME, {
        auth: {
          username: AUTHENTICATION.SUPERUSER.USERNAME,
          password: AUTHENTICATION.SUPERUSER.PASSWORD,
        },
        spaceId,
        tests: {
          spaceAware: {
            statusCode: 200,
            response: createExpectSpaceAwareResults(),
          },
          notSpaceAware: {
            statusCode: 200,
            response: expectNotSpaceAwareResults(),
          },
        }
      });

      createTest(AUTHENTICATION.KIBANA_LEGACY_USER.USERNAME, {
        auth: {
          username: AUTHENTICATION.KIBANA_LEGACY_USER.USERNAME,
          password: AUTHENTICATION.KIBANA_LEGACY_USER.PASSWORD,
        },
        spaceId,
        tests: {
          spaceAware: {
            statusCode: 200,
            response: createExpectSpaceAwareResults(),
          },
          notSpaceAware: {
            statusCode: 200,
            response: expectNotSpaceAwareResults,
          },
        }
      });

      createTest(AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER.USERNAME, {
        auth: {
          username: AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER.USERNAME,
          password: AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER.PASSWORD,
        },
        spaceId,
        tests: {
          spaceAware: {
            statusCode: 403,
            response: createExpectLegacyForbidden(AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER.USERNAME),
          },
          notSpaceAware: {
            statusCode: 403,
            response: createExpectLegacyForbidden(AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER.USERNAME),
          },
        }
      });

      createTest(AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_USER.USERNAME, {
        auth: {
          username: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_USER.USERNAME,
          password: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_USER.PASSWORD,
        },
        spaceId,
        tests: {
          spaceAware: {
            statusCode: 200,
            response: createExpectSpaceAwareResults(),
          },
          notSpaceAware: {
            statusCode: 200,
            response: expectNotSpaceAwareResults,
          },
        }
      });

      createTest(AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_DASHBOARD_ONLY_USER.USERNAME, {
        auth: {
          username: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_DASHBOARD_ONLY_USER.USERNAME,
          password: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_DASHBOARD_ONLY_USER.PASSWORD,
        },
        spaceId,
        tests: {
          spaceAware: {
            statusCode: 403,
            response: createExpectRbacForbidden(spaceAwareType),
          },
          notSpaceAware: {
            statusCode: 403,
            response: createExpectRbacForbidden(notSpaceAwareType),
          },
        }
      });

      createTest(AUTHENTICATION.KIBANA_RBAC_USER.USERNAME, {
        auth: {
          username: AUTHENTICATION.KIBANA_RBAC_USER.USERNAME,
          password: AUTHENTICATION.KIBANA_RBAC_USER.PASSWORD,
        },
        spaceId,
        tests: {
          spaceAware: {
            statusCode: 200,
            response: createExpectSpaceAwareResults(),
          },
          notSpaceAware: {
            statusCode: 200,
            response: expectNotSpaceAwareResults,
          },
        }
      });

      createTest(AUTHENTICATION.KIBANA_RBAC_DASHBOARD_ONLY_USER.USERNAME, {
        auth: {
          username: AUTHENTICATION.KIBANA_RBAC_DASHBOARD_ONLY_USER.USERNAME,
          password: AUTHENTICATION.KIBANA_RBAC_DASHBOARD_ONLY_USER.PASSWORD,
        },
        spaceId,
        tests: {
          spaceAware: {
            statusCode: 403,
            response: createExpectRbacForbidden(spaceAwareType),
          },
          notSpaceAware: {
            statusCode: 403,
            response: createExpectRbacForbidden(notSpaceAwareType),
          },
        }
      });

      createTest(userWithAllAtSpace.USERNAME, {
        auth: {
          username: userWithAllAtSpace.USERNAME,
          password: userWithAllAtSpace.PASSWORD,
        },
        tests: {
          spaceAware: {
            statusCode: 200,
            response: createExpectSpaceAwareResults(spaceId),
          },
          notSpaceAware: {
            statusCode: 200,
            response: expectNotSpaceAwareResults(),
          },
        }
      });

      createTest(userWithReadAtSpace.USERNAME, {
        auth: {
          username: userWithReadAtSpace.USERNAME,
          password: userWithReadAtSpace.PASSWORD,
        },
        tests: {
          spaceAware: {
            statusCode: 403,
            response: createExpectRbacForbidden(spaceAwareType),
          },
          notSpaceAware: {
            statusCode: 403,
            response: createExpectRbacForbidden(notSpaceAwareType),
          },
        }
      });

      createTest(userWithAllAtOtherSpace.USERNAME, {
        auth: {
          username: userWithAllAtOtherSpace.USERNAME,
          password: userWithAllAtOtherSpace.PASSWORD,
        },
        tests: {
          spaceAware: {
            statusCode: 403,
            response: createExpectRbacForbidden(spaceAwareType),
          },
          notSpaceAware: {
            statusCode: 403,
            response: createExpectRbacForbidden(notSpaceAwareType),
          },
        }
      });
    });

  });
}
