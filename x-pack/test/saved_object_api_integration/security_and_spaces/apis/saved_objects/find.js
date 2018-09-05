/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { AUTHENTICATION } from '../../../common/lib/authentication';
import { SPACES } from '../../../common/lib/spaces';
import { findTestSuiteFactory } from '../../../common/suites/saved_objects/find';

export default function ({ getService }) {
  const supertest = getService('supertestWithoutAuth');
  const esArchiver = getService('esArchiver');

  describe('find', () => {
    const {
      createExpectEmpty,
      createExpectRbacForbidden,
      createExpectResults,
      createExpectLegacyForbidden,
      createExpectVisualizationResults,
      findTest,
    } = findTestSuiteFactory(esArchiver, supertest);

    [{
      spaceId: SPACES.DEFAULT.spaceId,
      userWithAllAtSpace: AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_ALL_USER,
      userWithReadAtSpace: AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_READ_USER,
      userWithAllAtOtherSpace: AUTHENTICATION.KIBANA_RBAC_SPACE_1_ALL_USER,
    }, {
      spaceId: SPACES.SPACE_1.spaceId,
      userWithAllAtSpace: AUTHENTICATION.KIBANA_RBAC_SPACE_1_ALL_USER,
      userWithReadAtSpace: AUTHENTICATION.KIBANA_RBAC_SPACE_1_READ_USER,
      userWithAllAtOtherSpace: AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_ALL_USER,
    }].forEach(({
      spaceId,
      userWithAllAtSpace,
      userWithReadAtSpace,
      userWithAllAtOtherSpace
    }) => {
      describe(`${spaceId} space`, () => {
        findTest(AUTHENTICATION.NOT_A_KIBANA_USER.USERNAME, {
          auth: {
            username: AUTHENTICATION.NOT_A_KIBANA_USER.USERNAME,
            password: AUTHENTICATION.NOT_A_KIBANA_USER.PASSWORD,
          },
          spaceId,
          tests: {
            normal: {
              description: 'forbidden login and find visualization message',
              statusCode: 403,
              response: createExpectLegacyForbidden(AUTHENTICATION.NOT_A_KIBANA_USER.USERNAME),
            },
            unknownType: {
              description: 'forbidden login and find wigwags message',
              statusCode: 403,
              response: createExpectLegacyForbidden(AUTHENTICATION.NOT_A_KIBANA_USER.USERNAME),
            },
            pageBeyondTotal: {
              description: 'forbidden login and find visualization message',
              statusCode: 403,
              response: createExpectLegacyForbidden(AUTHENTICATION.NOT_A_KIBANA_USER.USERNAME),
            },
            unknownSearchField: {
              description: 'forbidden login and find wigwags message',
              statusCode: 403,
              response: createExpectLegacyForbidden(AUTHENTICATION.NOT_A_KIBANA_USER.USERNAME),
            },
            noType: {
              description: `forbidded can't find any types`,
              statusCode: 403,
              response: createExpectLegacyForbidden(AUTHENTICATION.NOT_A_KIBANA_USER.USERNAME),
            }
          }
        });

        findTest(AUTHENTICATION.SUPERUSER.USERNAME, {
          auth: {
            username: AUTHENTICATION.SUPERUSER.USERNAME,
            password: AUTHENTICATION.SUPERUSER.PASSWORD,
          },
          spaceId,
          tests: {
            normal: {
              description: 'only the visualization',
              statusCode: 200,
              response: createExpectVisualizationResults(spaceId),
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
              response: createExpectResults(spaceId),
            },
          },
        });

        findTest(AUTHENTICATION.KIBANA_LEGACY_USER.USERNAME, {
          auth: {
            username: AUTHENTICATION.KIBANA_LEGACY_USER.USERNAME,
            password: AUTHENTICATION.KIBANA_LEGACY_USER.PASSWORD,
          },
          spaceId,
          tests: {
            normal: {
              description: 'only the visualization',
              statusCode: 200,
              response: createExpectVisualizationResults(spaceId),
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
              response: createExpectResults(spaceId),
            },
          },
        });

        findTest(AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER.USERNAME, {
          auth: {
            username: AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER.USERNAME,
            password: AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER.PASSWORD,
          },
          spaceId,
          tests: {
            normal: {
              description: 'only the visualization',
              statusCode: 200,
              response: createExpectVisualizationResults(spaceId),
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
              response: createExpectResults(spaceId),
            },
          }
        });

        findTest(AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_USER.USERNAME, {
          auth: {
            username: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_USER.USERNAME,
            password: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_USER.PASSWORD,
          },
          spaceId,
          tests: {
            normal: {
              description: 'only the visualization',
              statusCode: 200,
              response: createExpectVisualizationResults(spaceId),
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
              response: createExpectResults(spaceId),
            },
          },
        });

        findTest(AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_DASHBOARD_ONLY_USER.USERNAME, {
          auth: {
            username: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_DASHBOARD_ONLY_USER.USERNAME,
            password: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_DASHBOARD_ONLY_USER.PASSWORD,
          },
          spaceId,
          tests: {
            normal: {
              description: 'only the visualization',
              statusCode: 200,
              response: createExpectVisualizationResults(spaceId),
            },
            unknownType: {
              description: 'forbidden find wigwags message',
              statusCode: 403,
              response: createExpectRbacForbidden('wigwags'),
            },
            pageBeyondTotal: {
              description: 'empty result',
              statusCode: 200,
              response: createExpectEmpty(100, 100, 1),
            },
            unknownSearchField: {
              description: 'forbidden find wigwags message',
              statusCode: 403,
              response: createExpectRbacForbidden('wigwags'),
            },
            noType: {
              description: 'all objects',
              statusCode: 200,
              response: createExpectResults(spaceId),
            },
          }
        });

        findTest(AUTHENTICATION.KIBANA_RBAC_USER.USERNAME, {
          auth: {
            username: AUTHENTICATION.KIBANA_RBAC_USER.USERNAME,
            password: AUTHENTICATION.KIBANA_RBAC_USER.PASSWORD,
          },
          spaceId,
          tests: {
            normal: {
              description: 'only the visualization',
              statusCode: 200,
              response: createExpectVisualizationResults(spaceId),
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
              response: createExpectResults(spaceId),
            },
          },
        });

        findTest(AUTHENTICATION.KIBANA_RBAC_DASHBOARD_ONLY_USER.USERNAME, {
          auth: {
            username: AUTHENTICATION.KIBANA_RBAC_DASHBOARD_ONLY_USER.USERNAME,
            password: AUTHENTICATION.KIBANA_RBAC_DASHBOARD_ONLY_USER.PASSWORD,
          },
          spaceId,
          tests: {
            normal: {
              description: 'only the visualization',
              statusCode: 200,
              response: createExpectVisualizationResults(spaceId),
            },
            unknownType: {
              description: 'forbidden find wigwags message',
              statusCode: 403,
              response: createExpectRbacForbidden('wigwags'),
            },
            pageBeyondTotal: {
              description: 'empty result',
              statusCode: 200,
              response: createExpectEmpty(100, 100, 1),
            },
            unknownSearchField: {
              description: 'forbidden find wigwags message',
              statusCode: 403,
              response: createExpectRbacForbidden('wigwags'),
            },
            noType: {
              description: 'all objects',
              statusCode: 200,
              response: createExpectResults(spaceId),
            },
          }
        });

        findTest(userWithAllAtSpace.USERNAME, {
          auth: {
            username: userWithAllAtSpace.USERNAME,
            password: userWithAllAtSpace.PASSWORD,
          },
          spaceId,
          tests: {
            normal: {
              description: 'only the visualization',
              statusCode: 200,
              response: createExpectVisualizationResults(spaceId),
            },
            unknownType: {
              description: 'forbidden and find wigwags message',
              statusCode: 403,
              response: createExpectRbacForbidden('wigwags'),
            },
            pageBeyondTotal: {
              description: 'empty result',
              statusCode: 200,
              response: createExpectEmpty(100, 100, 1),
            },
            unknownSearchField: {
              description: 'forbidden and find wigwags message',
              statusCode: 403,
              response: createExpectRbacForbidden('wigwags'),
            },
            noType: {
              description: 'all objects',
              statusCode: 200,
              response: createExpectResults(spaceId),
            },
          }
        });

        findTest(userWithReadAtSpace.USERNAME, {
          auth: {
            username: userWithReadAtSpace.USERNAME,
            password: userWithReadAtSpace.PASSWORD,
          },
          spaceId,
          tests: {
            normal: {
              description: 'only the visualization',
              statusCode: 200,
              response: createExpectVisualizationResults(spaceId),
            },
            unknownType: {
              description: 'forbidden and find wigwags message',
              statusCode: 403,
              response: createExpectRbacForbidden('wigwags'),
            },
            pageBeyondTotal: {
              description: 'empty result',
              statusCode: 200,
              response: createExpectEmpty(100, 100, 1),
            },
            unknownSearchField: {
              description: 'forbidden and find wigwags message',
              statusCode: 403,
              response: createExpectRbacForbidden('wigwags'),
            },
            noType: {
              description: 'all objects',
              statusCode: 200,
              response: createExpectResults(spaceId),
            },
          }
        });

        findTest(userWithAllAtOtherSpace.USERNAME, {
          auth: {
            username: userWithAllAtOtherSpace.USERNAME,
            password: userWithAllAtOtherSpace.PASSWORD,
          },
          spaceId,
          tests: {
            normal: {
              description: 'forbidden login and find visualization message',
              statusCode: 403,
              response: createExpectRbacForbidden('visualization'),
            },
            unknownType: {
              description: 'forbidden login and find wigwags message',
              statusCode: 403,
              response: createExpectRbacForbidden('wigwags'),
            },
            pageBeyondTotal: {
              description: 'forbidden login and find visualization message',
              statusCode: 403,
              response: createExpectRbacForbidden('visualization'),
            },
            unknownSearchField: {
              description: 'forbidden login and find wigwags message',
              statusCode: 403,
              response: createExpectRbacForbidden('wigwags'),
            },
            noType: {
              description: `forbidded can't find any types`,
              statusCode: 403,
              response: createExpectRbacForbidden(),
            }
          }
        });
      });
    });
  });
}
