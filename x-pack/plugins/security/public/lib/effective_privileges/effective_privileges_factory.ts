/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import _ from 'lodash';
import { FeaturePrivilegeSet } from '../../../common/model/privileges/feature_privileges';
import { PrivilegeDefinition } from '../../../common/model/privileges/privilege_definition';
import { Role } from '../../../common/model/role';
import { copyRole } from '../../views/management/edit_role/lib/copy_role';
import { EffectivePrivileges } from './effective_privileges';
import { compareActions } from './effective_privileges_utils';

export class EffectivePrivilegesFactory {
  /** All feature privileges, sorted from most permissive => least permissive. */
  public readonly rankedFeaturePrivileges: FeaturePrivilegeSet;

  constructor(private readonly privilegeDefinition: PrivilegeDefinition) {
    this.rankedFeaturePrivileges = {};
    const featurePrivilegeSet = privilegeDefinition.getFeaturePrivileges().getAllPrivileges();

    Object.entries(featurePrivilegeSet).forEach(([featureId, privileges]) => {
      this.rankedFeaturePrivileges[featureId] = privileges.sort((privilege1, privilege2) => {
        const privilege1Actions = privilegeDefinition
          .getFeaturePrivileges()
          .getActions(featureId, privilege1);
        const privilege2Actions = privilegeDefinition
          .getFeaturePrivileges()
          .getActions(featureId, privilege2);
        return compareActions(privilege1Actions, privilege2Actions);
      });
    });
  }

  /**
   * Creates an EffectivePrivileges instance for the specified role.
   * @param role
   */
  public getInstance(role: Role) {
    const roleCopy = copyRole(role);

    this.sortPrivileges(roleCopy);
    return new EffectivePrivileges(
      this.privilegeDefinition,
      roleCopy,
      this.rankedFeaturePrivileges
    );
  }

  private sortPrivileges(role: Role) {
    role.kibana.forEach(privilege => {
      privilege.base.sort((privilege1, privilege2) => {
        const privilege1Actions = this.privilegeDefinition
          .getSpacesPrivileges()
          .getActions(privilege1);

        const privilege2Actions = this.privilegeDefinition
          .getSpacesPrivileges()
          .getActions(privilege2);

        return compareActions(privilege1Actions, privilege2Actions);
      });

      Object.entries(privilege.feature).forEach(([featureId, featurePrivs]) => {
        featurePrivs.sort((privilege1, privilege2) => {
          const privilege1Actions = this.privilegeDefinition
            .getFeaturePrivileges()
            .getActions(featureId, privilege1);

          const privilege2Actions = this.privilegeDefinition
            .getFeaturePrivileges()
            .getActions(featureId, privilege2);

          return compareActions(privilege1Actions, privilege2Actions);
        });
      });
    });
  }
}
