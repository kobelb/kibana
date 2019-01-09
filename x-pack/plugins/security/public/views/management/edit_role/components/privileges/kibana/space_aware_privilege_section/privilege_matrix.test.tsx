/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
// @ts-ignore
import { EuiButton, EuiInMemoryTable } from '@elastic/eui';
import React from 'react';
import { mountWithIntl } from 'test_utils/enzyme_helpers';
import { Space } from '../../../../../../../../../spaces/common/model/space';
import { Feature } from '../../../../../../../../../xpack_main/types';
import { PrivilegeDefinition } from '../../../../../../../../common/model/privileges/privilege_definition';
import { Role } from '../../../../../../../../common/model/role';
import { EffectivePrivilegesFactory } from '../../../../../../../lib/effective_privileges';
import { PrivilegeMatrix } from './privilege_matrix';

describe('PrivilegeMatrix', () => {
  it('can render a complex matrix', () => {
    const spaces: Space[] = ['*', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'].map(a => ({
      id: a,
      name: `${a} space`,
      disabledFeatures: [],
    }));

    const features: Feature[] = [
      {
        id: 'feature1',
        name: 'feature 1',
        privileges: {},
      },
      {
        id: 'feature2',
        name: 'feature 2',
        privileges: {},
      },
      {
        id: 'feature3',
        name: 'feature 3',
        privileges: {},
      },
    ];

    const role: Role = {
      name: 'role',
      elasticsearch: {
        cluster: [],
        indices: [],
        run_as: [],
      },
      kibana: {
        spaces: [
          {
            spaces: ['*'],
            minimum: ['read'],
            feature: {
              feature1: ['all'],
            },
          },
          {
            spaces: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
            minimum: [],
            feature: {
              feature2: ['read'],
              feature3: ['all'],
            },
          },
          {
            spaces: ['k'],
            minimum: ['all'],
            feature: {
              feature2: ['read'],
              feature3: ['read'],
            },
          },
        ],
      },
    };

    const effectivePrivileges = new EffectivePrivilegesFactory(
      new PrivilegeDefinition({
        global: {
          all: [],
          read: [],
        },
        features: {
          feature1: {
            all: [],
            read: [],
          },
        },
        space: {
          all: [],
          read: [],
        },
      })
    ).getInstance(role);

    const wrapper = mountWithIntl(
      <PrivilegeMatrix
        role={role}
        spaces={spaces}
        features={features}
        effectivePrivileges={effectivePrivileges}
      />
    );

    wrapper.find(EuiButton).simulate('click');
    wrapper.update();

    const { columns, items } = wrapper.find(EuiInMemoryTable).props() as any;

    expect(columns).toHaveLength(4); // all spaces groups plus the "feature" column
    expect(items).toHaveLength(features.length + 1); // all features plus the "base" row
  });
});
