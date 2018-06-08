/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { createDefaultRoles } from './create_default_roles';
import { DEFAULT_RESOURCE } from '../../../common/constants';

jest.mock('../../../../../server/lib/get_client_shield', () => ({
  getClient: jest.fn()
}));

const defaultApplication = 'foo-application';

const createMockConfig = (settings = {}) => {
  const defaultSettings = {
    'xpack.security.rbac.createDefaultRoles': true,
    'xpack.security.rbac.application': defaultApplication
  };

  return {
    get: jest.fn().mockImplementation(key => {
      return key in settings ? settings[key] : defaultSettings[key];
    })
  };
};

test(`doesn't create roles if createDefaultRoles is false`, async () => {
  const mockCallCluster = jest.fn();
  const mockConfig = createMockConfig({
    'xpack.security.rbac.createDefaultRoles': false
  });

  await createDefaultRoles(mockConfig, mockCallCluster);

  expect(mockCallCluster).toHaveBeenCalledTimes(0);
});

describe(`rbac_user`, () => {
  test(`doesn't create \${application}_rbac_user when it exists`, async () => {
    const mockCallCluster = jest.fn();
    const mockConfig = createMockConfig();
    mockCallCluster.mockReturnValue(null);

    await createDefaultRoles(mockConfig, mockCallCluster);

    expect(mockCallCluster).not.toHaveBeenCalledWith('shield.putRole', expect.anything());
  });

  test(`creates \${application}_rbac_user when it doesn't exist`, async () => {
    const mockCallCluster = jest.fn();
    const mockConfig = createMockConfig();
    mockCallCluster.mockImplementation(async (endpoint, params) => {
      if (endpoint === 'shield.getRole' && params.name === `${defaultApplication}_rbac_user`) {
        throw {
          statusCode: 404
        };
      }

      return null;
    });

    await createDefaultRoles(mockConfig, mockCallCluster);

    expect(mockCallCluster).toHaveBeenCalledWith('shield.putRole', {
      name: `${defaultApplication}_rbac_user`,
      body: {
        cluster: [],
        index: [],
        applications: [
          {
            application: defaultApplication,
            privileges: [ 'all' ],
            resources: [ DEFAULT_RESOURCE ]
          }
        ]
      }
    });
  });

  test(`throws error when shield.getRole throws non 404 error`, async () => {
    const mockCallCluster = jest.fn();
    const mockConfig = createMockConfig();
    mockCallCluster.mockImplementation(async (endpoint, params) => {
      if (endpoint === 'shield.getRole' && params.name === `${defaultApplication}_rbac_user`) {
        throw {
          statusCode: 500
        };
      }

      return null;
    });

    expect(createDefaultRoles(mockConfig, mockCallCluster)).rejects.toThrowErrorMatchingSnapshot();
  });

  test(`throws error when shield.putRole throws error`, async () => {
    const mockCallCluster = jest.fn();
    const mockConfig = createMockConfig();
    mockCallCluster.mockImplementation(async (endpoint, params) => {
      if (endpoint === 'shield.getRole' && params.name === `${defaultApplication}_rbac_user`) {
        throw {
          statusCode: 404
        };
      }

      if (endpoint === 'shield.putRole' && params.name === `${defaultApplication}_rbac_user`) {
        throw new Error('Some other error');
      }

      return null;
    });

    await expect(createDefaultRoles(mockConfig, mockCallCluster)).rejects.toThrowErrorMatchingSnapshot();
  });
});

describe(`dashboard_only_user`, () => {
  test(`doesn't create \${application}_rbac_dashboard_only_user when it exists`, async () => {
    const mockCallCluster = jest.fn();
    const mockConfig = createMockConfig();
    mockCallCluster.mockReturnValue(null);

    await createDefaultRoles(mockConfig, mockCallCluster);

    expect(mockCallCluster).not.toHaveBeenCalledWith('shield.putRole', expect.anything());
  });

  test(`creates \${application}_rbac_dashboard_only_user when it doesn't exist`, async () => {
    const mockCallCluster = jest.fn();
    const mockConfig = createMockConfig();
    mockCallCluster.mockImplementation(async (endpoint, params) => {
      if (endpoint === 'shield.getRole' && params.name === `${defaultApplication}_rbac_dashboard_only_user`) {
        throw {
          statusCode: 404
        };
      }

      return null;
    });

    await createDefaultRoles(mockConfig, mockCallCluster);

    expect(mockCallCluster).toHaveBeenCalledWith('shield.putRole', {
      name: `${defaultApplication}_rbac_dashboard_only_user`,
      body: {
        cluster: [],
        index: [],
        applications: [
          {
            application: defaultApplication,
            privileges: [ 'read' ],
            resources: [ DEFAULT_RESOURCE ]
          }
        ]
      }
    });
  });

  test(`throws error when shield.getRole throws non 404 error`, async () => {
    const mockCallCluster = jest.fn();
    const mockConfig = createMockConfig();
    mockCallCluster.mockImplementation(async (endpoint, params) => {
      if (endpoint === 'shield.getRole' && params.name === `${defaultApplication}_rbac_dashboard_only_user`) {
        throw {
          statusCode: 500
        };
      }

      return null;
    });

    await expect(createDefaultRoles(mockConfig, mockCallCluster)).rejects.toThrowErrorMatchingSnapshot();
  });

  test(`throws error when shield.putRole throws error`, async () => {
    const mockCallCluster = jest.fn();
    const mockConfig = createMockConfig();
    mockCallCluster.mockImplementation(async (endpoint, params) => {
      if (endpoint === 'shield.getRole' && params.name === `${defaultApplication}_rbac_dashboard_only_user`) {
        throw {
          statusCode: 404
        };
      }

      if (endpoint === 'shield.putRole' && params.name === `${defaultApplication}_rbac_dashboard_only_user`) {
        throw new Error('Some other error');
      }

      return null;
    });

    await expect(createDefaultRoles(mockConfig, mockCallCluster)).rejects.toThrowErrorMatchingSnapshot();
  });
});
