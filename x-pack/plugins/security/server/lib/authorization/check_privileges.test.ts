/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { uniq } from 'lodash';
import { GLOBAL_RESOURCE } from '../../../common/constants';
import { checkPrivilegesWithRequestFactory } from './check_privileges';
import { HasPrivilegesResponse } from './types';

const application = 'kibana-our_application';

const mockActions = {
  login: 'mock-action:login',
  version: 'mock-action:version',
};

const savedObjectTypes = ['foo-type', 'bar-type'];

const createMockShieldClient = (response: any) => {
  const mockCallWithRequest = jest.fn();

  mockCallWithRequest.mockImplementationOnce(async () => response);

  return {
    callWithRequest: mockCallWithRequest,
  };
};

describe('#atSpace', () => {
  const checkPrivilegesAtSpaceTest = (
    description: string,
    options: {
      spaceId: string;
      privilegeOrPrivileges: string | string[];
      clusterPrivileges: string[];
      esHasPrivilegesResponse: HasPrivilegesResponse;
      expectedResult?: any;
      expectErrorThrown?: any;
    }
  ) => {
    test(description, async () => {
      const mockShieldClient = createMockShieldClient(options.esHasPrivilegesResponse);
      const checkPrivilegesWithRequest = checkPrivilegesWithRequestFactory(
        mockActions,
        application,
        mockShieldClient
      );
      const request = Symbol();
      const checkPrivileges = checkPrivilegesWithRequest(request);

      let actualResult;
      let errorThrown = null;
      try {
        actualResult = await checkPrivileges.atSpace(
          options.spaceId,
          options.privilegeOrPrivileges,
          options.clusterPrivileges
        );
      } catch (err) {
        errorThrown = err;
      }

      expect(mockShieldClient.callWithRequest).toHaveBeenCalledWith(
        request,
        'shield.hasPrivileges',
        {
          body: {
            cluster: options.clusterPrivileges,
            applications: [
              {
                application,
                resources: [`space:${options.spaceId}`],
                privileges: uniq([
                  mockActions.version,
                  mockActions.login,
                  ...(Array.isArray(options.privilegeOrPrivileges)
                    ? options.privilegeOrPrivileges
                    : [options.privilegeOrPrivileges]),
                ]),
              },
            ],
          },
        }
      );

      if (options.expectedResult) {
        expect(errorThrown).toBeNull();
        expect(actualResult).toEqual(options.expectedResult);
      }

      if (options.expectErrorThrown) {
        expect(errorThrown).not.toBeNull();
        expect(errorThrown).toMatchSnapshot();
      }
    });
  };

  checkPrivilegesAtSpaceTest('returns login privilege when checking for login', {
    spaceId: 'space_1',
    privilegeOrPrivileges: mockActions.login,
    clusterPrivileges: [],
    esHasPrivilegesResponse: {
      has_all_requested: true,
      username: 'foo-username',
      cluster: {},
      application: {
        [application]: {
          'space:space_1': {
            [mockActions.login]: true,
            [mockActions.version]: true,
          },
        },
      },
    },
    expectedResult: {
      hasAllRequested: true,
      username: 'foo-username',
      privileges: {
        [mockActions.login]: true,
      },
      clusterPrivileges: {},
    },
  });

  checkPrivilegesAtSpaceTest(
    `throws error when checking for login and user has login but doesn't have version`,
    {
      spaceId: 'space_1',
      privilegeOrPrivileges: mockActions.login,
      clusterPrivileges: [],
      esHasPrivilegesResponse: {
        has_all_requested: false,
        username: 'foo-username',
        cluster: {},
        application: {
          [application]: {
            'space:space_1': {
              [mockActions.login]: true,
              [mockActions.version]: false,
            },
          },
        },
      },
      expectErrorThrown: true,
    }
  );

  checkPrivilegesAtSpaceTest(`successful when checking two application and cluster privileges`, {
    spaceId: 'space_1',
    privilegeOrPrivileges: [
      `saved_object:${savedObjectTypes[0]}/get`,
      `saved_object:${savedObjectTypes[1]}/get`,
    ],
    clusterPrivileges: ['manage_foo', 'monitor_bar'],
    esHasPrivilegesResponse: {
      has_all_requested: false,
      username: 'foo-username',
      cluster: {
        manage_foo: true,
        monitor_bar: false,
      },
      application: {
        [application]: {
          'space:space_1': {
            [mockActions.login]: true,
            [mockActions.version]: true,
            [`saved_object:${savedObjectTypes[0]}/get`]: true,
            [`saved_object:${savedObjectTypes[1]}/get`]: false,
          },
        },
      },
    },
    expectedResult: {
      hasAllRequested: false,
      username: 'foo-username',
      privileges: {
        [`saved_object:${savedObjectTypes[0]}/get`]: true,
        [`saved_object:${savedObjectTypes[1]}/get`]: false,
      },
      clusterPrivileges: {
        manage_foo: true,
        monitor_bar: false,
      },
    },
  });

  describe('with a malformed Elasticsearch response', () => {
    checkPrivilegesAtSpaceTest(
      `throws a validation error when an extra privilege is present in the response`,
      {
        spaceId: 'space_1',
        privilegeOrPrivileges: [`saved_object:${savedObjectTypes[0]}/get`],
        clusterPrivileges: [],
        esHasPrivilegesResponse: {
          has_all_requested: false,
          username: 'foo-username',
          cluster: {},
          application: {
            [application]: {
              'space:space_1': {
                [mockActions.login]: true,
                [mockActions.version]: true,
                [`saved_object:${savedObjectTypes[0]}/get`]: false,
                [`saved_object:${savedObjectTypes[1]}/get`]: true,
              },
            },
          },
        },
        expectErrorThrown: true,
      }
    );

    checkPrivilegesAtSpaceTest(
      `throws a validation error when application privileges are missing in the response`,
      {
        spaceId: 'space_1',
        privilegeOrPrivileges: [`saved_object:${savedObjectTypes[0]}/get`],
        clusterPrivileges: [],
        esHasPrivilegesResponse: {
          has_all_requested: false,
          username: 'foo-username',
          cluster: {},
          application: {
            [application]: {
              'space:space_1': {
                [mockActions.login]: true,
                [mockActions.version]: true,
              },
            },
          },
        },
        expectErrorThrown: true,
      }
    );

    checkPrivilegesAtSpaceTest(
      `throws a validation error when a cluster privilege is missing in the response`,
      {
        spaceId: 'space_1',
        privilegeOrPrivileges: [],
        clusterPrivileges: ['manage_foo', 'monitor_bar'],
        esHasPrivilegesResponse: {
          has_all_requested: false,
          username: 'foo-username',
          cluster: {
            manage_foo: true,
          },
          application: {
            [application]: {
              'space:space_1': {
                [mockActions.login]: true,
                [mockActions.version]: true,
              },
            },
          },
        },
        expectErrorThrown: true,
      }
    );

    checkPrivilegesAtSpaceTest(
      `throws a validation error when an extra cluster privilege is in the response`,
      {
        spaceId: 'space_1',
        privilegeOrPrivileges: [],
        clusterPrivileges: ['manage_foo', 'monitor_bar'],
        esHasPrivilegesResponse: {
          has_all_requested: false,
          username: 'foo-username',
          cluster: {
            manage_foo: true,
            monitor_bar: true,
            manage_bar: false,
          },
          application: {
            [application]: {
              'space:space_1': {
                [mockActions.login]: true,
                [mockActions.version]: true,
              },
            },
          },
        },
        expectErrorThrown: true,
      }
    );
  });
});

describe('#atSpaces', () => {
  const checkPrivilegesAtSpacesTest = (
    description: string,
    options: {
      spaceIds: string[];
      privilegeOrPrivileges: string | string[];
      clusterPrivileges: string[];
      esHasPrivilegesResponse: HasPrivilegesResponse;
      expectedResult?: any;
      expectErrorThrown?: any;
    }
  ) => {
    test(description, async () => {
      const mockShieldClient = createMockShieldClient(options.esHasPrivilegesResponse);
      const checkPrivilegesWithRequest = checkPrivilegesWithRequestFactory(
        mockActions,
        application,
        mockShieldClient
      );
      const request = Symbol();
      const checkPrivileges = checkPrivilegesWithRequest(request);

      let actualResult;
      let errorThrown = null;
      try {
        actualResult = await checkPrivileges.atSpaces(
          options.spaceIds,
          options.privilegeOrPrivileges,
          options.clusterPrivileges
        );
      } catch (err) {
        errorThrown = err;
      }

      expect(mockShieldClient.callWithRequest).toHaveBeenCalledWith(
        request,
        'shield.hasPrivileges',
        {
          body: {
            cluster: options.clusterPrivileges,
            applications: [
              {
                application,
                resources: options.spaceIds.map(spaceId => `space:${spaceId}`),
                privileges: uniq([
                  mockActions.version,
                  mockActions.login,
                  ...(Array.isArray(options.privilegeOrPrivileges)
                    ? options.privilegeOrPrivileges
                    : [options.privilegeOrPrivileges]),
                ]),
              },
            ],
          },
        }
      );

      if (options.expectedResult) {
        expect(errorThrown).toBeNull();
        expect(actualResult).toEqual(options.expectedResult);
      }

      if (options.expectErrorThrown) {
        expect(errorThrown).not.toBeNull();
        expect(errorThrown).toMatchSnapshot();
      }
    });
  };

  checkPrivilegesAtSpacesTest('returns login privileges when checking for login', {
    spaceIds: ['space_1', 'space_2'],
    privilegeOrPrivileges: mockActions.login,
    clusterPrivileges: [],
    esHasPrivilegesResponse: {
      has_all_requested: true,
      username: 'foo-username',
      cluster: {},
      application: {
        [application]: {
          'space:space_1': {
            [mockActions.login]: true,
            [mockActions.version]: true,
          },
          'space:space_2': {
            [mockActions.login]: true,
            [mockActions.version]: true,
          },
        },
      },
    },
    expectedResult: {
      hasAllRequested: true,
      username: 'foo-username',
      spacePrivileges: {
        space_1: {
          [mockActions.login]: true,
        },
        space_2: {
          [mockActions.login]: true,
        },
      },
      clusterPrivileges: {},
    },
  });

  checkPrivilegesAtSpacesTest(
    `throws error when checking for login and user has login but doesn't have version`,
    {
      spaceIds: ['space_1', 'space_2'],
      privilegeOrPrivileges: mockActions.login,
      clusterPrivileges: [],
      esHasPrivilegesResponse: {
        has_all_requested: false,
        username: 'foo-username',
        cluster: {},
        application: {
          [application]: {
            'space:space_1': {
              [mockActions.login]: true,
              [mockActions.version]: false,
            },
            'space:space_2': {
              [mockActions.login]: true,
              [mockActions.version]: false,
            },
          },
        },
      },
      expectErrorThrown: true,
    }
  );

  checkPrivilegesAtSpacesTest(
    `successful when checking two application and cluster privileges at two spaces`,
    {
      spaceIds: ['space_1', 'space_2'],
      privilegeOrPrivileges: [
        `saved_object:${savedObjectTypes[0]}/get`,
        `saved_object:${savedObjectTypes[1]}/get`,
      ],
      clusterPrivileges: ['manage_foo', 'monitor_bar'],
      esHasPrivilegesResponse: {
        has_all_requested: false,
        username: 'foo-username',
        cluster: {
          manage_foo: true,
          monitor_bar: false,
        },
        application: {
          [application]: {
            'space:space_1': {
              [mockActions.login]: true,
              [mockActions.version]: true,
              [`saved_object:${savedObjectTypes[0]}/get`]: true,
              [`saved_object:${savedObjectTypes[1]}/get`]: false,
            },
            'space:space_2': {
              [mockActions.login]: true,
              [mockActions.version]: true,
              [`saved_object:${savedObjectTypes[0]}/get`]: false,
              [`saved_object:${savedObjectTypes[1]}/get`]: true,
            },
          },
        },
      },
      expectedResult: {
        hasAllRequested: false,
        username: 'foo-username',
        spacePrivileges: {
          space_1: {
            [`saved_object:${savedObjectTypes[0]}/get`]: true,
            [`saved_object:${savedObjectTypes[1]}/get`]: false,
          },
          space_2: {
            [`saved_object:${savedObjectTypes[0]}/get`]: false,
            [`saved_object:${savedObjectTypes[1]}/get`]: true,
          },
        },
        clusterPrivileges: {
          manage_foo: true,
          monitor_bar: false,
        },
      },
    }
  );

  describe('with a malformed Elasticsearch response', () => {
    checkPrivilegesAtSpacesTest(`throws error when Elasticsearch returns malformed response`, {
      spaceIds: ['space_1', 'space_2'],
      privilegeOrPrivileges: [
        `saved_object:${savedObjectTypes[0]}/get`,
        `saved_object:${savedObjectTypes[1]}/get`,
      ],
      clusterPrivileges: [],
      esHasPrivilegesResponse: {
        has_all_requested: true,
        username: 'foo-username',
        cluster: {},
        application: {
          [application]: {
            'space:space_1': {
              [`saved_object:${savedObjectTypes[0]}/get`]: true,
              [`saved_object:${savedObjectTypes[1]}/get`]: true,
            },
            'space:space_2': {
              [`saved_object:${savedObjectTypes[0]}/get`]: true,
              [`saved_object:${savedObjectTypes[1]}/get`]: true,
            },
          },
        },
      },
      expectErrorThrown: true,
    });

    checkPrivilegesAtSpacesTest(
      `throws a validation error when an extra privilege is present in the response`,
      {
        spaceIds: ['space_1', 'space_2'],
        privilegeOrPrivileges: [`saved_object:${savedObjectTypes[0]}/get`],
        clusterPrivileges: [],
        esHasPrivilegesResponse: {
          has_all_requested: false,
          username: 'foo-username',
          cluster: {},
          application: {
            [application]: {
              'space:space_1': {
                [mockActions.login]: true,
                [mockActions.version]: true,
                [`saved_object:${savedObjectTypes[0]}/get`]: false,
                [`saved_object:${savedObjectTypes[1]}/get`]: true,
              },
              // @ts-ignore this is wrong on purpose
              'space:space_1': {
                [mockActions.login]: true,
                [mockActions.version]: true,
                [`saved_object:${savedObjectTypes[0]}/get`]: false,
              },
            },
          },
        },
        expectErrorThrown: true,
      }
    );

    checkPrivilegesAtSpacesTest(
      `throws a validation error when privileges are missing in the response`,
      {
        spaceIds: ['space_1', 'space_2'],
        privilegeOrPrivileges: [`saved_object:${savedObjectTypes[0]}/get`],
        clusterPrivileges: [],
        esHasPrivilegesResponse: {
          has_all_requested: false,
          username: 'foo-username',
          cluster: {},
          application: {
            [application]: {
              'space:space_1': {
                [mockActions.login]: true,
                [mockActions.version]: true,
              },
              // @ts-ignore this is wrong on purpose
              'space:space_1': {
                [mockActions.login]: true,
                [mockActions.version]: true,
                [`saved_object:${savedObjectTypes[0]}/get`]: false,
              },
            },
          },
        },
        expectErrorThrown: true,
      }
    );

    checkPrivilegesAtSpacesTest(
      `throws a validation error when an extra space is present in the response`,
      {
        spaceIds: ['space_1', 'space_2'],
        privilegeOrPrivileges: [`saved_object:${savedObjectTypes[0]}/get`],
        clusterPrivileges: [],
        esHasPrivilegesResponse: {
          has_all_requested: false,
          username: 'foo-username',
          cluster: {},
          application: {
            [application]: {
              'space:space_1': {
                [mockActions.login]: true,
                [mockActions.version]: true,
                [`saved_object:${savedObjectTypes[0]}/get`]: false,
              },
              'space:space_2': {
                [mockActions.login]: true,
                [mockActions.version]: true,
                [`saved_object:${savedObjectTypes[0]}/get`]: false,
              },
              'space:space_3': {
                [mockActions.login]: true,
                [mockActions.version]: true,
                [`saved_object:${savedObjectTypes[0]}/get`]: false,
              },
            },
          },
        },
        expectErrorThrown: true,
      }
    );

    checkPrivilegesAtSpacesTest(
      `throws a validation error when an a space is missing in the response`,
      {
        spaceIds: ['space_1', 'space_2'],
        privilegeOrPrivileges: [`saved_object:${savedObjectTypes[0]}/get`],
        clusterPrivileges: [],
        esHasPrivilegesResponse: {
          has_all_requested: false,
          username: 'foo-username',
          cluster: {},
          application: {
            [application]: {
              'space:space_1': {
                [mockActions.login]: true,
                [mockActions.version]: true,
                [`saved_object:${savedObjectTypes[0]}/get`]: false,
              },
            },
          },
        },
        expectErrorThrown: true,
      }
    );

    checkPrivilegesAtSpacesTest(
      `throws a validation error when missing a cluster privilege in the response`,
      {
        spaceIds: ['space_1', 'space_2'],
        privilegeOrPrivileges: [`saved_object:${savedObjectTypes[0]}/get`],
        clusterPrivileges: ['manage_foo', 'monitor_bar'],
        esHasPrivilegesResponse: {
          has_all_requested: false,
          username: 'foo-username',
          cluster: {
            manage_foo: true,
          },
          application: {
            [application]: {
              'space:space_1': {
                [mockActions.login]: true,
                [mockActions.version]: true,
                [`saved_object:${savedObjectTypes[0]}/get`]: false,
              },
              'space:space_2': {
                [mockActions.login]: true,
                [mockActions.version]: true,
                [`saved_object:${savedObjectTypes[0]}/get`]: false,
              },
            },
          },
        },
        expectErrorThrown: true,
      }
    );

    checkPrivilegesAtSpacesTest(
      `throws a validation error when there's an extra cluster privilege in the response`,
      {
        spaceIds: ['space_1', 'space_2'],
        privilegeOrPrivileges: [`saved_object:${savedObjectTypes[0]}/get`],
        clusterPrivileges: ['manage_foo', 'monitor_bar'],
        esHasPrivilegesResponse: {
          has_all_requested: false,
          username: 'foo-username',
          cluster: {
            manage_foo: true,
            monitor_bar: true,
            manage_bar: false,
          },
          application: {
            [application]: {
              'space:space_1': {
                [mockActions.login]: true,
                [mockActions.version]: true,
                [`saved_object:${savedObjectTypes[0]}/get`]: false,
              },
              'space:space_2': {
                [mockActions.login]: true,
                [mockActions.version]: true,
                [`saved_object:${savedObjectTypes[0]}/get`]: false,
              },
            },
          },
        },
        expectErrorThrown: true,
      }
    );
  });
});

describe('#globally', () => {
  const checkPrivilegesGloballyTest = (
    description: string,
    options: {
      privilegeOrPrivileges: string | string[];
      clusterPrivileges: string[];
      esHasPrivilegesResponse: HasPrivilegesResponse;
      expectedResult?: any;
      expectErrorThrown?: any;
    }
  ) => {
    test(description, async () => {
      const mockShieldClient = createMockShieldClient(options.esHasPrivilegesResponse);
      const checkPrivilegesWithRequest = checkPrivilegesWithRequestFactory(
        mockActions,
        application,
        mockShieldClient
      );
      const request = Symbol();
      const checkPrivileges = checkPrivilegesWithRequest(request);

      let actualResult;
      let errorThrown = null;
      try {
        actualResult = await checkPrivileges.globally(
          options.privilegeOrPrivileges,
          options.clusterPrivileges
        );
      } catch (err) {
        errorThrown = err;
      }

      expect(mockShieldClient.callWithRequest).toHaveBeenCalledWith(
        request,
        'shield.hasPrivileges',
        {
          body: {
            cluster: options.clusterPrivileges,
            applications: [
              {
                application,
                resources: [GLOBAL_RESOURCE],
                privileges: uniq([
                  mockActions.version,
                  mockActions.login,
                  ...(Array.isArray(options.privilegeOrPrivileges)
                    ? options.privilegeOrPrivileges
                    : [options.privilegeOrPrivileges]),
                ]),
              },
            ],
          },
        }
      );

      if (options.expectedResult) {
        expect(errorThrown).toBeNull();
        expect(actualResult).toEqual(options.expectedResult);
      }

      if (options.expectErrorThrown) {
        expect(errorThrown).not.toBeNull();
        expect(errorThrown).toMatchSnapshot();
      }
    });
  };

  checkPrivilegesGloballyTest('returns login privilege when checking for login', {
    privilegeOrPrivileges: mockActions.login,
    clusterPrivileges: [],
    esHasPrivilegesResponse: {
      has_all_requested: true,
      username: 'foo-username',
      cluster: {},
      application: {
        [application]: {
          [GLOBAL_RESOURCE]: {
            [mockActions.login]: true,
            [mockActions.version]: true,
          },
        },
      },
    },
    expectedResult: {
      hasAllRequested: true,
      username: 'foo-username',
      privileges: {
        [mockActions.login]: true,
      },
      clusterPrivileges: {},
    },
  });

  checkPrivilegesGloballyTest(
    `throws error when checking for login and user has login but doesn't have version`,
    {
      privilegeOrPrivileges: mockActions.login,
      clusterPrivileges: [],
      esHasPrivilegesResponse: {
        has_all_requested: false,
        username: 'foo-username',
        cluster: {},
        application: {
          [application]: {
            [GLOBAL_RESOURCE]: {
              [mockActions.login]: true,
              [mockActions.version]: false,
            },
          },
        },
      },
      expectErrorThrown: true,
    }
  );

  checkPrivilegesGloballyTest(
    `successful when checking for two application and cluster privileges`,
    {
      privilegeOrPrivileges: [
        `saved_object:${savedObjectTypes[0]}/get`,
        `saved_object:${savedObjectTypes[1]}/get`,
      ],
      clusterPrivileges: ['manage_foo', 'monitor_bar'],
      esHasPrivilegesResponse: {
        has_all_requested: false,
        username: 'foo-username',
        cluster: {
          manage_foo: true,
          monitor_bar: false,
        },
        application: {
          [application]: {
            [GLOBAL_RESOURCE]: {
              [mockActions.login]: true,
              [mockActions.version]: true,
              [`saved_object:${savedObjectTypes[0]}/get`]: true,
              [`saved_object:${savedObjectTypes[1]}/get`]: false,
            },
          },
        },
      },
      expectedResult: {
        hasAllRequested: false,
        username: 'foo-username',
        privileges: {
          [`saved_object:${savedObjectTypes[0]}/get`]: true,
          [`saved_object:${savedObjectTypes[1]}/get`]: false,
        },
        clusterPrivileges: {
          manage_foo: true,
          monitor_bar: false,
        },
      },
    }
  );

  describe('with a malformed Elasticsearch response', () => {
    checkPrivilegesGloballyTest(
      `throws a validation error when an extra privilege is present in the response`,
      {
        privilegeOrPrivileges: [`saved_object:${savedObjectTypes[0]}/get`],
        clusterPrivileges: [],
        esHasPrivilegesResponse: {
          has_all_requested: false,
          username: 'foo-username',
          cluster: {},
          application: {
            [application]: {
              [GLOBAL_RESOURCE]: {
                [mockActions.login]: true,
                [mockActions.version]: true,
                [`saved_object:${savedObjectTypes[0]}/get`]: false,
                [`saved_object:${savedObjectTypes[1]}/get`]: true,
              },
            },
          },
        },
        expectErrorThrown: true,
      }
    );

    checkPrivilegesGloballyTest(
      `throws a validation error when privileges are missing in the response`,
      {
        privilegeOrPrivileges: [`saved_object:${savedObjectTypes[0]}/get`],
        clusterPrivileges: [],
        esHasPrivilegesResponse: {
          has_all_requested: false,
          username: 'foo-username',
          cluster: {},
          application: {
            [application]: {
              [GLOBAL_RESOURCE]: {
                [mockActions.login]: true,
                [mockActions.version]: true,
              },
            },
          },
        },
        expectErrorThrown: true,
      }
    );

    checkPrivilegesGloballyTest(
      `throws a validation error when cluster privilege is missing in the response`,
      {
        privilegeOrPrivileges: [`saved_object:${savedObjectTypes[0]}/get`],
        clusterPrivileges: ['manage_foo', 'monitor_bar'],
        esHasPrivilegesResponse: {
          has_all_requested: false,
          username: 'foo-username',
          cluster: {
            manage_foo: true,
          },
          application: {
            [application]: {
              [GLOBAL_RESOURCE]: {
                [mockActions.login]: true,
                [mockActions.version]: true,
                [`saved_object:${savedObjectTypes[0]}/get`]: true,
              },
            },
          },
        },
        expectErrorThrown: true,
      }
    );

    checkPrivilegesGloballyTest(
      `throws a validation error when an extra cluster privilege is in the response`,
      {
        privilegeOrPrivileges: [`saved_object:${savedObjectTypes[0]}/get`],
        clusterPrivileges: ['manage_foo', 'monitor_bar'],
        esHasPrivilegesResponse: {
          has_all_requested: false,
          username: 'foo-username',
          cluster: {
            manage_foo: true,
            monitor_bar: true,
            manage_bar: false,
          },
          application: {
            [application]: {
              [GLOBAL_RESOURCE]: {
                [mockActions.login]: true,
                [mockActions.version]: true,
                [`saved_object:${savedObjectTypes[0]}/get`]: true,
              },
            },
          },
        },
        expectErrorThrown: true,
      }
    );
  });
});
