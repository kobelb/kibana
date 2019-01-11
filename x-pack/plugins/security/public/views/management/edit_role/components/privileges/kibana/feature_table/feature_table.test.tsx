/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
// @ts-ignore
import { EuiInMemoryTable } from '@elastic/eui';
import React from 'react';
import { mountWithIntl, shallowWithIntl } from 'test_utils/enzyme_helpers';
import { FeaturePrivilegeSet } from '../../../../../../../../common/model/privileges/feature_privileges';
import { PrivilegeDefinition } from '../../../../../../../../common/model/privileges/privilege_definition';
import { Role } from '../../../../../../../../common/model/role';
import { EffectivePrivilegesFactory } from '../../../../../../../lib/effective_privileges';
import { FeatureTable } from './feature_table';

const defaultPrivilegeDefinition = new PrivilegeDefinition({
  global: {
    all: ['api:/*', 'ui:/*'],
    read: ['ui:/feature1/foo', 'ui:/feature2/foo'],
  },
  space: {
    all: ['api:/*', 'ui:/*'],
    read: ['ui:/feature1/foo', 'ui:/feature2/foo'],
  },
  features: {
    feature1: {
      all: ['ui:/feature1/foo', 'ui:/feature1/bar'],
      read: ['ui:/feature1/foo'],
    },
    feature2: {
      all: ['ui:/feature2/foo', 'api:/feature2/bar'],
      read: ['ui:/feature2/foo'],
    },
    feature3: {
      all: ['ui:/feature3/foo'],
    },
    feature4: {
      all: ['somethingObsecure:/foo'],
    },
  },
});

interface BuildRoleOpts {
  globalPrivilege?: {
    base: string[];
    feature: FeaturePrivilegeSet;
  };
  spacesPrivileges?: Array<{
    spaces: string[];
    base: string[];
    feature: FeaturePrivilegeSet;
  }>;
}
const buildRole = (options: BuildRoleOpts = {}) => {
  const role: Role = {
    name: 'unit test role',
    elasticsearch: {
      indices: [],
      cluster: [],
      run_as: [],
    },
    kibana: [],
  };

  if (options.globalPrivilege) {
    role.kibana.push({
      spaces: ['*'],
      ...options.globalPrivilege,
    });
  }

  if (options.spacesPrivileges) {
    role.kibana.push(...options.spacesPrivileges);
  }

  return role;
};

const buildFeatures = () => {
  return [];
};

describe('FeatureTable', () => {
  it('can render without spaces', () => {
    const role = buildRole({
      spacesPrivileges: [
        {
          spaces: ['marketing', 'default'],
          base: ['read'],
          feature: {
            feature1: ['all'],
          },
        },
      ],
    });
    const wrapper = shallowWithIntl(
      <FeatureTable
        role={role}
        privilegeDefinition={defaultPrivilegeDefinition}
        effectivePrivileges={new EffectivePrivilegesFactory(defaultPrivilegeDefinition).getInstance(
          role
        )}
        features={buildFeatures()}
        onChange={jest.fn()}
        onChangeAll={jest.fn()}
        spacesIndex={0}
        intl={null as any}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it('can render for a specific spaces entry', () => {
    const role = buildRole();
    const wrapper = mountWithIntl(
      <FeatureTable
        role={role}
        privilegeDefinition={defaultPrivilegeDefinition}
        effectivePrivileges={new EffectivePrivilegesFactory(defaultPrivilegeDefinition).getInstance(
          role
        )}
        features={buildFeatures()}
        onChange={jest.fn()}
        onChangeAll={jest.fn()}
        spacesIndex={-1}
        intl={null as any}
      />
    );

    expect(wrapper.find(EuiInMemoryTable)).toHaveLength(1);
  });
});
