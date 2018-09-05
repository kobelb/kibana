/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { AUTHENTICATION } from '../../../common/lib/authentication';
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

    findTest(`not a kibana user`, {
      auth: {
        username: AUTHENTICATION.NOT_A_KIBANA_USER.USERNAME,
        password: AUTHENTICATION.NOT_A_KIBANA_USER.PASSWORD,
      },
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

    findTest(`superuser`, {
      auth: {
        username: AUTHENTICATION.SUPERUSER.USERNAME,
        password: AUTHENTICATION.SUPERUSER.PASSWORD,
      },
      tests: {
        normal: {
          description: 'only the visualization',
          statusCode: 200,
          response: createExpectVisualizationResults(),
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
          response: createExpectResults(),
        },
      },
    });

    findTest(`kibana legacy user`, {
      auth: {
        username: AUTHENTICATION.KIBANA_LEGACY_USER.USERNAME,
        password: AUTHENTICATION.KIBANA_LEGACY_USER.PASSWORD,
      },
      tests: {
        normal: {
          description: 'only the visualization',
          statusCode: 200,
          response: createExpectVisualizationResults(),
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
          response: createExpectResults(),
        },
      },
    });

    findTest(`kibana legacy dashboard only user`, {
      auth: {
        username: AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER.USERNAME,
        password: AUTHENTICATION.KIBANA_LEGACY_DASHBOARD_ONLY_USER.PASSWORD,
      },
      tests: {
        normal: {
          description: 'only the visualization',
          statusCode: 200,
          response: createExpectVisualizationResults(),
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
          response: createExpectResults(),
        },
      }
    });

    findTest(`kibana dual-privileges user`, {
      auth: {
        username: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_USER.USERNAME,
        password: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_USER.PASSWORD,
      },
      tests: {
        normal: {
          description: 'only the visualization',
          statusCode: 200,
          response: createExpectVisualizationResults(),
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
          response: createExpectResults(),
        },
      },
    });

    findTest(`kibana dual-privileges dashboard only user`, {
      auth: {
        username: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_DASHBOARD_ONLY_USER.USERNAME,
        password: AUTHENTICATION.KIBANA_DUAL_PRIVILEGES_DASHBOARD_ONLY_USER.PASSWORD,
      },
      tests: {
        normal: {
          description: 'only the visualization',
          statusCode: 200,
          response: createExpectVisualizationResults(),
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
          response: createExpectResults(),
        },
      }
    });

    findTest(`kibana rbac user`, {
      auth: {
        username: AUTHENTICATION.KIBANA_RBAC_USER.USERNAME,
        password: AUTHENTICATION.KIBANA_RBAC_USER.PASSWORD,
      },
      tests: {
        normal: {
          description: 'only the visualization',
          statusCode: 200,
          response: createExpectVisualizationResults(),
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
          response: createExpectResults(),
        },
      },
    });

    findTest(`kibana rbac dashboard only user`, {
      auth: {
        username: AUTHENTICATION.KIBANA_RBAC_DASHBOARD_ONLY_USER.USERNAME,
        password: AUTHENTICATION.KIBANA_RBAC_DASHBOARD_ONLY_USER.PASSWORD,
      },
      tests: {
        normal: {
          description: 'only the visualization',
          statusCode: 200,
          response: createExpectVisualizationResults(),
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
          response: createExpectResults(),
        },
      }
    });

    findTest(`kibana rbac default space all user`, {
      auth: {
        username: AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_ALL_USER.USERNAME,
        password: AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_ALL_USER.PASSWORD,
      },
      tests: {
        normal: {
          description: 'only the visualization',
          statusCode: 403,
          response: createExpectLegacyForbidden(AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_ALL_USER.USERNAME),
        },
        unknownType: {
          description: 'empty result',
          statusCode: 403,
          response: createExpectLegacyForbidden(AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_ALL_USER.USERNAME),
        },
        pageBeyondTotal: {
          description: 'empty result',
          statusCode: 403,
          response: createExpectLegacyForbidden(AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_ALL_USER.USERNAME),
        },
        unknownSearchField: {
          description: 'empty result',
          statusCode: 403,
          response: createExpectLegacyForbidden(AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_ALL_USER.USERNAME),
        },
        noType: {
          description: 'all objects',
          statusCode: 403,
          response: createExpectLegacyForbidden(AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_ALL_USER.USERNAME),
        },
      }
    });

    findTest(`kibana rbac default space read user`, {
      auth: {
        username: AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_READ_USER.USERNAME,
        password: AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_READ_USER.PASSWORD,
      },
      tests: {
        normal: {
          description: 'only the visualization',
          statusCode: 403,
          response: createExpectLegacyForbidden(AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_READ_USER.USERNAME),
        },
        unknownType: {
          description: 'empty result',
          statusCode: 403,
          response: createExpectLegacyForbidden(AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_READ_USER.USERNAME),
        },
        pageBeyondTotal: {
          description: 'empty result',
          statusCode: 403,
          response: createExpectLegacyForbidden(AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_READ_USER.USERNAME),
        },
        unknownSearchField: {
          description: 'empty result',
          statusCode: 403,
          response: createExpectLegacyForbidden(AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_READ_USER.USERNAME),
        },
        noType: {
          description: 'all objects',
          statusCode: 403,
          response: createExpectLegacyForbidden(AUTHENTICATION.KIBANA_RBAC_DEFAULT_SPACE_READ_USER.USERNAME),
        },
      }
    });

    findTest(`kibana rbac space 1 all user`, {
      auth: {
        username: AUTHENTICATION.KIBANA_RBAC_SPACE_1_ALL_USER.USERNAME,
        password: AUTHENTICATION.KIBANA_RBAC_SPACE_1_ALL_USER.PASSWORD,
      },
      tests: {
        normal: {
          description: 'forbidden login and find visualization message',
          statusCode: 403,
          response: createExpectLegacyForbidden(AUTHENTICATION.KIBANA_RBAC_SPACE_1_ALL_USER.USERNAME),
        },
        unknownType: {
          description: 'forbidden login and find wigwags message',
          statusCode: 403,
          response: createExpectLegacyForbidden(AUTHENTICATION.KIBANA_RBAC_SPACE_1_ALL_USER.USERNAME),
        },
        pageBeyondTotal: {
          description: 'forbidden login and find visualization message',
          statusCode: 403,
          response: createExpectLegacyForbidden(AUTHENTICATION.KIBANA_RBAC_SPACE_1_ALL_USER.USERNAME),
        },
        unknownSearchField: {
          description: 'forbidden login and find wigwags message',
          statusCode: 403,
          response: createExpectLegacyForbidden(AUTHENTICATION.KIBANA_RBAC_SPACE_1_ALL_USER.USERNAME),
        },
        noType: {
          description: `forbidded can't find any types`,
          statusCode: 403,
          response: createExpectLegacyForbidden(AUTHENTICATION.KIBANA_RBAC_SPACE_1_ALL_USER.USERNAME),
        }
      }
    });

    findTest(`kibana rbac space 1 readonly user`, {
      auth: {
        username: AUTHENTICATION.KIBANA_RBAC_SPACE_1_READ_USER.USERNAME,
        password: AUTHENTICATION.KIBANA_RBAC_SPACE_1_READ_USER.PASSWORD,
      },
      tests: {
        normal: {
          description: 'forbidden login and find visualization message',
          statusCode: 403,
          response: createExpectLegacyForbidden(AUTHENTICATION.KIBANA_RBAC_SPACE_1_READ_USER.USERNAME),
        },
        unknownType: {
          description: 'forbidden login and find wigwags message',
          statusCode: 403,
          response: createExpectLegacyForbidden(AUTHENTICATION.KIBANA_RBAC_SPACE_1_READ_USER.USERNAME),
        },
        pageBeyondTotal: {
          description: 'forbidden login and find visualization message',
          statusCode: 403,
          response: createExpectLegacyForbidden(AUTHENTICATION.KIBANA_RBAC_SPACE_1_READ_USER.USERNAME),
        },
        unknownSearchField: {
          description: 'forbidden login and find wigwags message',
          statusCode: 403,
          response: createExpectLegacyForbidden(AUTHENTICATION.KIBANA_RBAC_SPACE_1_READ_USER.USERNAME),
        },
        noType: {
          description: `forbidded can't find any types`,
          statusCode: 403,
          response: createExpectLegacyForbidden(AUTHENTICATION.KIBANA_RBAC_SPACE_1_READ_USER.USERNAME),
        }
      }
    });
  });
}
