/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import {
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  // @ts-ignore
  EuiInMemoryTable,
  EuiText,
} from '@elastic/eui';
import React, { Component } from 'react';
import { Space } from '../../../../../../../../spaces/common/model/space';
import { SpaceAvatar } from '../../../../../../../../spaces/public/components';
import { KibanaPrivilege } from '../../../../../../../common/model/kibana_privilege';
import { Role } from '../../../../../../../common/model/role';
import { isReservedRole } from '../../../../../../lib/role';
import { PrivilegeSelector } from './privilege_selector';

interface Props {
  role: Role;
  spaces: Space[];
  availablePrivileges?: KibanaPrivilege[];
  spacePrivileges: any;
  onChange?: (privs: { [spaceId: string]: KibanaPrivilege[] }) => void;
  readonly?: boolean;
}

interface State {
  searchTerm: string;
}

interface DeletedSpace extends Space {
  deleted: boolean;
}

export class PrivilegeSpaceTable extends Component<Props, State> {
  public state = {
    searchTerm: '',
  };

  public render() {
    const { role, spaces, availablePrivileges, spacePrivileges } = this.props;

    const { searchTerm } = this.state;

    const allTableItems = Object.keys(spacePrivileges)
      .map(spaceId => {
        return {
          space: spaces.find(s => s.id === spaceId) || { id: spaceId, name: '', deleted: true },
          privilege: spacePrivileges[spaceId][0],
        };
      })
      .sort(item1 => {
        const isDeleted = 'deleted' in item1.space;
        return isDeleted ? 1 : -1;
      });

    const visibleTableItems = allTableItems.filter(item => {
      const isDeleted = 'deleted' in item.space;
      const searchField = isDeleted ? item.space.id : item.space.name;
      return searchField.toLowerCase().indexOf(searchTerm) >= 0;
    });

    if (allTableItems.length === 0) {
      return null;
    }

    return (
      <EuiInMemoryTable
        hasActions
        columns={this.getTableColumns(role, availablePrivileges)}
        search={{
          box: {
            incremental: true,
            placeholder: 'Filter',
          },
          onChange: (search: any) => {
            this.setState({
              searchTerm: search.queryText.toLowerCase(),
            });
          },
        }}
        items={visibleTableItems}
      />
    );
  }

  public getTableColumns = (role: Role, availablePrivileges: KibanaPrivilege[] = []) => {
    const columns: any[] = [
      {
        field: 'space',
        name: 'Space',
        width: this.props.readonly ? '75%' : '50%',
        render: (space: Space | DeletedSpace) => {
          let content;
          if ('deleted' in space) {
            content = [
              <EuiFlexItem key={1}>
                <EuiText color={'subdued'}>{space.id} (deleted)</EuiText>
              </EuiFlexItem>,
            ];
          } else {
            content = [
              <EuiFlexItem key={1} grow={false}>
                <SpaceAvatar space={space} size="s" />
              </EuiFlexItem>,
              <EuiFlexItem key={2}>
                <EuiText>{space.name}</EuiText>
              </EuiFlexItem>,
            ];
          }
          return (
            <EuiFlexGroup gutterSize="s" responsive={false} alignItems={'center'}>
              {content}
            </EuiFlexGroup>
          );
        },
      },
      {
        field: 'privilege',
        name: 'Privilege',
        width: this.props.readonly ? '25%' : undefined,
        render: (privilege: KibanaPrivilege, record: any) => {
          if (this.props.readonly || record.space.deleted) {
            return privilege;
          }

          return (
            <PrivilegeSelector
              data-test-subj={'privilege-space-table-priv'}
              availablePrivileges={availablePrivileges}
              value={privilege}
              disabled={isReservedRole(role) || this.props.readonly}
              onChange={this.onSpacePermissionChange(record)}
              compressed
            />
          );
        },
      },
    ];
    if (!this.props.readonly) {
      columns.push({
        name: 'Actions',
        actions: [
          {
            render: (record: any) => {
              return (
                <EuiButtonIcon
                  aria-label={'Remove custom privileges for this space'}
                  color={'danger'}
                  onClick={() => this.onDeleteSpacePermissionsClick(record)}
                  iconType={'trash'}
                />
              );
            },
          },
        ],
      });
    }

    return columns;
  };

  public onSpacePermissionChange = (record: any) => (selectedPrivilege: KibanaPrivilege) => {
    const { id: spaceId } = record.space;

    const updatedPrivileges = {
      ...this.props.spacePrivileges,
    };
    updatedPrivileges[spaceId] = [selectedPrivilege];
    if (this.props.onChange) {
      this.props.onChange(updatedPrivileges);
    }
  };

  public onDeleteSpacePermissionsClick = (record: any) => {
    const { id: spaceId } = record.space;

    const updatedPrivileges = {
      ...this.props.spacePrivileges,
    };
    delete updatedPrivileges[spaceId];
    if (this.props.onChange) {
      this.props.onChange(updatedPrivileges);
    }
  };
}
