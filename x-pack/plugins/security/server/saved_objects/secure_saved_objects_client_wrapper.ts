/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import {
  SavedObjectAttributes,
  SavedObjectsBaseOptions,
  SavedObjectsBulkCreateObject,
  SavedObjectsBulkGetObject,
  SavedObjectsBulkUpdateObject,
  SavedObjectsClientContract,
  SavedObjectsCreateOptions,
  SavedObjectsFindOptions,
  SavedObjectsUpdateOptions,
  SavedObjectsPredicate,
  SavedObjectsPredicates,
  PropertyEqualsSavedObjectsPredicate,
} from '../../../../../src/core/server';
import { SecurityAuditLogger } from '../audit';
import { Actions, CheckSavedObjectsPrivileges } from '../authorization';

interface SecureSavedObjectsClientWrapperOptions {
  actions: Actions;
  auditLogger: SecurityAuditLogger;
  baseClient: SavedObjectsClientContract;
  errors: SavedObjectsClientContract['errors'];
  checkSavedObjectsPrivilegesAsCurrentUser: CheckSavedObjectsPrivileges;
  savedObjectsPrivileges: SavedObjectsPrivileges;
}

interface EnsureAuthorizedForTypeResult {
  predicate?: SavedObjectsPredicate;
}

export class SecureSavedObjectsClientWrapper implements SavedObjectsClientContract {
  private readonly actions: Actions;
  private readonly auditLogger: PublicMethodsOf<SecurityAuditLogger>;
  private readonly baseClient: SavedObjectsClientContract;
  private readonly checkSavedObjectsPrivilegesAsCurrentUser: CheckSavedObjectsPrivileges;
  public readonly errors: SavedObjectsClientContract['errors'];
  private readonly savedObjectsPrivileges: SavedObjectsPrivileges;
  constructor({
    actions,
    auditLogger,
    baseClient,
    checkSavedObjectsPrivilegesAsCurrentUser,
    errors,
    savedObjectsPrivileges,
  }: SecureSavedObjectsClientWrapperOptions) {
    this.errors = errors;
    this.actions = actions;
    this.auditLogger = auditLogger;
    this.baseClient = baseClient;
    this.checkSavedObjectsPrivilegesAsCurrentUser = checkSavedObjectsPrivilegesAsCurrentUser;
    this.savedObjectsPrivileges = savedObjectsPrivileges;
  }

  public async create<T extends SavedObjectAttributes>(
    type: string,
    attributes: T = {} as T,
    options: SavedObjectsCreateOptions = {}
  ) {
    const { predicate } = await this.ensureAuthorizedForType(type, 'create', options.namespace, {
      type,
      attributes,
      options,
    });
    options.predicate = this.andPredicates(options.predicate, predicate);
    return await this.baseClient.create(type, attributes, options);
  }

  public async bulkCreate(
    objects: SavedObjectsBulkCreateObject[],
    options: SavedObjectsBaseOptions = {}
  ) {
    await this.ensureAuthorized(
      this.getUniqueObjectTypes(objects),
      'bulk_create',
      options.namespace,
      { objects, options }
    );

    return await this.baseClient.bulkCreate(objects, options);
  }

  public async delete(type: string, id: string, options: SavedObjectsBaseOptions = {}) {
    await this.ensureAuthorized(type, 'delete', options.namespace, { type, id, options });

    return await this.baseClient.delete(type, id, options);
  }

  public async find(options: SavedObjectsFindOptions) {
    await this.ensureAuthorized(options.type, 'find', options.namespace, { options });

    return this.baseClient.find(options);
  }

  public async bulkGet(
    objects: SavedObjectsBulkGetObject[] = [],
    options: SavedObjectsBaseOptions = {}
  ) {
    await this.ensureAuthorized(this.getUniqueObjectTypes(objects), 'bulk_get', options.namespace, {
      objects,
      options,
    });

    return await this.baseClient.bulkGet(objects, options);
  }

  public async get(type: string, id: string, options: SavedObjectsBaseOptions = {}) {
    await this.ensureAuthorized(type, 'get', options.namespace, { type, id, options });

    return await this.baseClient.get(type, id, options);
  }

  public async update<T extends SavedObjectAttributes>(
    type: string,
    id: string,
    attributes: Partial<T>,
    options: SavedObjectsUpdateOptions = {}
  ) {
    await this.ensureAuthorized(type, 'update', options.namespace, {
      type,
      id,
      attributes,
      options,
    });

    return await this.baseClient.update(type, id, attributes, options);
  }

  public async bulkUpdate(
    objects: SavedObjectsBulkUpdateObject[] = [],
    options: SavedObjectsBaseOptions = {}
  ) {
    await this.ensureAuthorized(
      this.getUniqueObjectTypes(objects),
      'bulk_update',
      options && options.namespace,
      { objects, options }
    );

    return await this.baseClient.bulkUpdate(objects, options);
  }

  private async checkPrivileges(actions: string | string[], namespace?: string) {
    try {
      return await this.checkSavedObjectsPrivilegesAsCurrentUser(actions, namespace);
    } catch (error) {
      throw this.errors.decorateGeneralError(error, error.body && error.body.reason);
    }
  }

  private async ensureAuthorized(
    typeOrTypes: string | string[],
    action: string,
    namespace?: string,
    args?: Record<string, unknown>
  ) {
    const types = Array.isArray(typeOrTypes) ? typeOrTypes : [typeOrTypes];
    const actionsToTypesMap = new Map(
      types.map(type => [this.actions.savedObject.get(type, action), type])
    );
    const actions = Array.from(actionsToTypesMap.keys());
    const { hasAllRequested, username, privileges } = await this.checkPrivileges(
      actions,
      namespace
    );

    if (hasAllRequested) {
      this.auditLogger.savedObjectsAuthorizationSuccess(username, action, types, args);
    } else {
      const missingPrivileges = this.getMissingPrivileges(privileges);
      this.auditLogger.savedObjectsAuthorizationFailure(
        username,
        action,
        types,
        missingPrivileges,
        args
      );
      const msg = `Unable to ${action} ${missingPrivileges
        .map(privilege => actionsToTypesMap.get(privilege))
        .sort()
        .join(',')}`;
      throw this.errors.decorateForbiddenError(new Error(msg));
    }
  }

  private async ensureAuthorizedForType(
    type: string,
    action: string,
    namespace?: string,
    args?: Record<string, unknown>
  ): Promise<EnsureAuthorizedForTypeResult> {
    const actions: string[] = [];
    actions.push(this.actions.savedObject.get(type, action));
    if (this.savedObjectsPrivileges.hasConditionalPrivileges(type)) {
      const conditions = this.savedObjectsPrivileges.getConditions(type);
      for (const condition of conditions) {
        actions.push(this.actions.savedObject.get({ type, when: condition }, action));
      }
    }

    const { username, privileges } = await this.checkPrivileges(actions, namespace);

    if (privileges[this.actions.savedObject.get(type, action)] === true) {
      this.auditLogger.savedObjectsAuthorizationSuccess(username, action, [type], args);
      return {};
    }

    if (this.savedObjectsPrivileges.hasConditionalPrivileges(type)) {
      const predicates: SavedObjectsPredicate[] = [];
      const conditions = this.savedObjectsPrivileges.getConditions(type);
      for (const condition of conditions) {
        if (privileges[this.actions.savedObject.get({ type, when: condition }, action)] === true) {
          if (!Array.isArray(condition)) {
            predicates.push(
              new PropertyEqualsSavedObjectsPredicate(condition.key, condition.value)
            );
          } else {
            predicates.push(
              new SavedObjectsPredicates(
                'AND',
                condition.map(
                  ({ key, value }) => new PropertyEqualsSavedObjectsPredicate(key, value)
                )
              )
            );
          }
        }
      }
      if (predicates.length > 0) {
        this.auditLogger.savedObjectsAuthorizationSuccess(username, action, [type], args);
        return {
          predicate: new SavedObjectsPredicates('OR', predicates),
        };
      }
    }

    const missingPrivileges = Object.keys(privileges);
    this.auditLogger.savedObjectsAuthorizationFailure(
      username,
      action,
      [type],
      missingPrivileges,
      args
    );
    const msg = `Unable to ${action} ${missingPrivileges.join(',')}`;
    throw this.errors.decorateForbiddenError(new Error(msg));
  }

  private getMissingPrivileges(privileges: Record<string, boolean>) {
    return Object.keys(privileges).filter(privilege => !privileges[privilege]);
  }

  private getUniqueObjectTypes(objects: Array<{ type: string }>) {
    return [...new Set(objects.map(o => o.type))];
  }

  private andPredicates(
    predicate1: SavedObjectsPredicate | undefined,
    predicate2: SavedObjectsPredicate | undefined
  ): SavedObjectsPredicate | undefined {
    if (predicate1 == null && predicate2 == null) {
      return undefined;
    }

    if (predicate2 == null) {
      return predicate1;
    }

    if (predicate1 == null) {
      return predicate2;
    }

    return new SavedObjectsPredicates('AND', [predicate1, predicate2]);
  }
}
