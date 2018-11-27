/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { Actions } from '../';
import { Feature } from '../../../../../xpack_main/types';
import { uiCapabilitesFactory } from './ui_capabilities';

const actions = new Actions('1.0.0-zeta1');
const mockRequest = {
  foo: Symbol(),
};

const createMockServer = (options: {
  checkPrivileges: {
    reject?: any;
    resolve?: any;
  };
  features: Feature[];
}) => {
  const mockSpacesPlugin = {
    getSpaceId: () => 'foo',
  };

  const mockAuthorizationService = {
    actions,
    checkPrivilegesDynamicallyWithRequest(request: any) {
      expect(request).toBe(mockRequest);

      return jest.fn().mockImplementation(checkActions => {
        if (options.checkPrivileges.reject) {
          throw options.checkPrivileges.reject;
        }

        if (options.checkPrivileges.resolve) {
          expect(checkActions).toEqual(Object.keys(options.checkPrivileges.resolve.privileges));
          return options.checkPrivileges.resolve;
        }

        throw new Error('resolve or reject should have been provided');
      });
    },
  };

  const mockXPackMainPlugin = {
    getFeatures: jest.fn().mockReturnValue(options.features),
  };

  return {
    plugins: {
      xpack_main: mockXPackMainPlugin,
      spaces: mockSpacesPlugin,
      security: {
        authorization: mockAuthorizationService,
      },
    },
  };
};

describe('disableUsingPrivileges', () => {
  describe('checkPrivileges errors', () => {
    test(`disables all uiCapabilities when a 401 is thrown`, async () => {
      const mockServer = createMockServer({
        checkPrivileges: {
          reject: {
            statusCode: 401,
          },
        },
        features: [],
      });
      const { disableUsingPrivileges } = uiCapabilitesFactory(mockServer, mockRequest);
      const result = await disableUsingPrivileges(
        Object.freeze({
          navLinks: {
            foo: true,
            bar: true,
          },
          fooFeature: {
            foo: true,
            bar: true,
          },
          barFeature: {
            foo: true,
            bar: true,
          },
        })
      );

      expect(result).toEqual({
        navLinks: {
          foo: false,
          bar: false,
        },
        fooFeature: {
          foo: false,
          bar: false,
        },
        barFeature: {
          foo: false,
          bar: false,
        },
      });
    });

    test(`disables all uiCapabilities when a 403 is thrown`, async () => {
      const mockServer = createMockServer({
        checkPrivileges: {
          reject: {
            statusCode: 403,
          },
        },
        features: [],
      });
      const { disableUsingPrivileges } = uiCapabilitesFactory(mockServer, mockRequest);
      const result = await disableUsingPrivileges(
        Object.freeze({
          navLinks: {
            foo: true,
            bar: true,
          },
          fooFeature: {
            foo: true,
            bar: true,
          },
          barFeature: {
            foo: true,
            bar: true,
          },
        })
      );

      expect(result).toEqual({
        navLinks: {
          foo: false,
          bar: false,
        },
        fooFeature: {
          foo: false,
          bar: false,
        },
        barFeature: {
          foo: false,
          bar: false,
        },
      });
    });

    test(`otherwise it throws the error`, async () => {
      const mockServer = createMockServer({
        checkPrivileges: {
          reject: new Error('something else entirely'),
        },
        features: [],
      });
      const { disableUsingPrivileges } = uiCapabilitesFactory(mockServer, mockRequest);
      await expect(
        disableUsingPrivileges({
          navLinks: {
            foo: true,
            bar: false,
          },
        })
      ).rejects.toThrowErrorMatchingSnapshot();
    });
  });

  test(`disables ui capabilities when they don't have the application privileges`, async () => {
    const mockServer = createMockServer({
      checkPrivileges: {
        resolve: {
          privileges: {
            [actions.ui.get('navLinks', 'foo')]: true,
            [actions.ui.get('navLinks', 'bar')]: false,
            [actions.ui.get('fooFeature', 'foo')]: true,
            [actions.ui.get('fooFeature', 'bar')]: false,
          },
        },
      },
      features: [],
    });
    const { disableUsingPrivileges } = uiCapabilitesFactory(mockServer, mockRequest);
    const result = await disableUsingPrivileges(
      Object.freeze({
        navLinks: {
          foo: true,
          bar: true,
        },
        fooFeature: {
          foo: true,
          bar: true,
        },
      })
    );

    expect(result).toEqual({
      navLinks: {
        foo: true,
        bar: false,
      },
      fooFeature: {
        foo: true,
        bar: false,
      },
    });
  });

  test(`disables ui capabilities when they don't have the cluster privilege`, async () => {
    const mockServer = createMockServer({
      checkPrivileges: {
        resolve: {
          privileges: {
            [actions.ui.get('navLinks', 'foo')]: false,
            [actions.ui.get('navLinks', 'bar')]: true,
            [actions.ui.get('fooFeature', 'foo')]: false,
            [actions.ui.get('fooFeature', 'bar')]: true,
          },
          clusterPrivileges: {
            cluster_foo: false,
          },
        },
      },
      features: [
        {
          id: 'fooFeature',
          name: 'Foo',
          privileges: {
            cluster: {
              cluster_foo: {
                ui: {
                  navLink: true,
                  capability: ['foo'],
                },
              },
            },
          },
        },
      ],
    });
    const { disableUsingPrivileges } = uiCapabilitesFactory(mockServer, mockRequest);
    const result = await disableUsingPrivileges(
      Object.freeze({
        navLinks: {
          foo: true,
          bar: true,
        },
        fooFeature: {
          foo: true,
          bar: true,
        },
      })
    );

    expect(result).toEqual({
      navLinks: {
        foo: false,
        bar: true,
      },
      fooFeature: {
        foo: false,
        bar: true,
      },
    });
  });

  test(`doesn't disable ui capabilities when they only have the cluster privilege`, async () => {
    const mockServer = createMockServer({
      checkPrivileges: {
        resolve: {
          privileges: {
            [actions.ui.get('navLinks', 'foo')]: false,
            [actions.ui.get('navLinks', 'bar')]: false,
            [actions.ui.get('fooFeature', 'foo')]: false,
            [actions.ui.get('fooFeature', 'bar')]: false,
          },
          clusterPrivileges: {
            cluster_foo: true,
          },
        },
      },
      features: [
        {
          id: 'fooFeature',
          name: 'Foo',
          navLinkId: 'foo',
          privileges: {
            cluster: {
              cluster_foo: {
                ui: {
                  navLink: true,
                  capability: ['foo'],
                },
              },
            },
          },
        },
      ],
    });
    const { disableUsingPrivileges } = uiCapabilitesFactory(mockServer, mockRequest);
    const result = await disableUsingPrivileges(
      Object.freeze({
        navLinks: {
          foo: true,
          bar: true,
        },
        fooFeature: {
          foo: true,
          bar: true,
        },
      })
    );

    expect(result).toEqual({
      navLinks: {
        foo: true,
        bar: false,
      },
      fooFeature: {
        foo: true,
        bar: false,
      },
    });
  });

  test(`doesn't re-enable disabled uiCapabilities`, async () => {
    const mockServer = createMockServer({
      checkPrivileges: {
        resolve: {
          privileges: {
            [actions.ui.get('navLinks', 'foo')]: true,
            [actions.ui.get('navLinks', 'bar')]: true,
            [actions.ui.get('fooFeature', 'foo')]: true,
            [actions.ui.get('fooFeature', 'bar')]: true,
            [actions.ui.get('barFeature', 'foo')]: true,
            [actions.ui.get('barFeature', 'bar')]: true,
          },
        },
      },
      features: [],
    });
    const { disableUsingPrivileges } = uiCapabilitesFactory(mockServer, mockRequest);
    const result = await disableUsingPrivileges(
      Object.freeze({
        navLinks: {
          foo: false,
          bar: false,
        },
        fooFeature: {
          foo: false,
          bar: false,
        },
        barFeature: {
          foo: false,
          bar: false,
        },
      })
    );

    expect(result).toEqual({
      navLinks: {
        foo: false,
        bar: false,
      },
      fooFeature: {
        foo: false,
        bar: false,
      },
      barFeature: {
        foo: false,
        bar: false,
      },
    });
  });
});

describe('disableAll', () => {
  test(`disables all uiCapabilities`, () => {
    const mockServer = createMockServer({
      checkPrivileges: {
        reject: new Error(`Don't use me`),
      },
      features: [],
    });
    const { disableAll } = uiCapabilitesFactory(mockServer, mockRequest);
    const result = disableAll(
      Object.freeze({
        navLinks: {
          foo: true,
          bar: true,
        },
        fooFeature: {
          foo: true,
          bar: true,
        },
        barFeature: {
          foo: true,
          bar: true,
        },
      })
    );
    expect(result).toEqual({
      navLinks: {
        foo: false,
        bar: false,
      },
      fooFeature: {
        foo: false,
        bar: false,
      },
      barFeature: {
        foo: false,
        bar: false,
      },
    });
  });
});
