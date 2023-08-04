/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type {
  Logger,
  SavedObject,
  SavedObjectsExportTransformContext,
  SavedObjectsServiceSetup,
} from '@kbn/core/server';
import { schema } from '@kbn/config-schema';
import { EncryptedSavedObjectsPluginSetup } from '@kbn/encrypted-saved-objects-plugin/server';
import { MigrateFunctionsObject } from '@kbn/kibana-utils-plugin/common';
import { ALERTING_CASES_SAVED_OBJECT_INDEX } from '@kbn/core-saved-objects-server';
import { alertMappings } from '../../common/saved_objects/rules/mappings';
import { rulesSettingsMappings } from './rules_settings_mappings';
import { maintenanceWindowMappings } from './maintenance_window_mapping';
import { getMigrations } from './migrations';
import { transformRulesForExport } from './transform_rule_for_export';
import { RawRule } from '../types';
import { getImportWarnings } from './get_import_warnings';
import { isRuleExportable } from './is_rule_exportable';
import { RuleTypeRegistry } from '../rule_type_registry';
export { partiallyUpdateAlert } from './partially_update_alert';
import {
  RULES_SETTINGS_SAVED_OBJECT_TYPE,
  MAINTENANCE_WINDOW_SAVED_OBJECT_TYPE,
} from '../../common';

export const AlertAttributesIncludedInAAD = [
  'name',
  'tags',
  'enabled',
  'alertTypeId',
  'consumer',
  'legacyId',
  'schedule',
  'actions',
  'params',
  'mapped_params',
  'createdBy',
  'createdAt',
  'apiKeyOwner',
  'apiKeyCreatedByUser',
  'throttle',
  'notifyWhen',
  'meta',
];

// useful for Pick<RawAlert, AlertAttributesExcludedFromAADType> which is a
// type which is a subset of RawAlert with just attributes excluded from AAD

// useful for Pick<RawAlert, AlertAttributesExcludedFromAADType>
export type AlertAttributesExcludedFromAADType =
  | 'scheduledTaskId'
  | 'muteAll'
  | 'mutedInstanceIds'
  | 'updatedBy'
  | 'updatedAt'
  | 'executionStatus'
  | 'monitoring'
  | 'snoozeEndTime'
  | 'snoozeSchedule'
  | 'isSnoozedUntil'
  | 'lastRun'
  | 'nextRun'
  | 'revision'
  | 'running';

export function setupSavedObjects(
  savedObjects: SavedObjectsServiceSetup,
  encryptedSavedObjects: EncryptedSavedObjectsPluginSetup,
  ruleTypeRegistry: RuleTypeRegistry,
  logger: Logger,
  isPreconfigured: (connectorId: string) => boolean,
  getSearchSourceMigrations: () => MigrateFunctionsObject
) {
  savedObjects.registerType({
    name: 'alert',
    indexPattern: ALERTING_CASES_SAVED_OBJECT_INDEX,
    hidden: true,
    namespaceType: 'multiple-isolated',
    convertToMultiNamespaceTypeVersion: '8.0.0',
    migrations: getMigrations(encryptedSavedObjects, getSearchSourceMigrations(), isPreconfigured),
    mappings: alertMappings,
    modelVersions: {
      // initial model version
      1: {
        changes: [],
        schemas: {
          // FC schema defining the known fields (indexed or not) for this version
          forwardCompatibility: schema.object(
            {
              name: schema.string(),
              tags: schema.arrayOf(schema.string()),
              enabled: schema.boolean(),
              alertTypeId: schema.string(),
              consumer: schema.string(),
              legacyId: schema.nullable(schema.string()),
              schedule: schema.object({
                interval: schema.string(),
              }),
              actions: schema.any(),
              params: schema.any(),
              mapped_params: schema.maybe(schema.any()),
              scheduledTaskId: schema.maybe(schema.nullable(schema.string())),
              createdBy: schema.nullable(schema.string()),
              updatedBy: schema.nullable(schema.string()),
              createdAt: schema.string(),
              updatedAt: schema.string(),
              apiKey: schema.nullable(schema.string()),
              apiKeyOwner: schema.nullable(schema.string()),
              apiKeyCreatedByUser: schema.maybe(schema.nullable(schema.boolean())),
              throttle: schema.maybe(schema.nullable(schema.string())),
              notifyWhen: schema.maybe(schema.nullable(schema.any())),
              muteAll: schema.boolean(),
              mutedInstanceIds: schema.arrayOf(schema.string()),
              meta: schema.maybe(schema.any()),
              executionStatus: schema.any(),
              monitoring: schema.maybe(schema.any()),
              snoozeSchedule: schema.maybe(schema.arrayOf(schema.any())),
              isSnoozedUntil: schema.maybe(schema.nullable(schema.string())),
              lastRun: schema.maybe(schema.nullable(schema.any())),
              nextRun: schema.maybe(schema.nullable(schema.string())),
              revision: schema.number(),
              running: schema.maybe(schema.nullable(schema.boolean())),
            },
            { unknowns: 'ignore' } // note the `unknown: ignore` which is how we're evicting the unknown fields
          ),
        },
      },
      // adding foo (optional string) to the model version
      2: {
        changes: [],
        schemas: {
          // FC schema defining the known fields (indexed or not) for this version
          forwardCompatibility: schema.object(
            {
              foo: schema.maybe(schema.string()),
              name: schema.string(),
              tags: schema.arrayOf(schema.string()),
              enabled: schema.boolean(),
              alertTypeId: schema.string(),
              consumer: schema.string(),
              legacyId: schema.nullable(schema.string()),
              schedule: schema.object({
                interval: schema.string(),
              }),
              actions: schema.any(),
              params: schema.any(),
              mapped_params: schema.maybe(schema.any()),
              scheduledTaskId: schema.maybe(schema.nullable(schema.string())),
              createdBy: schema.nullable(schema.string()),
              updatedBy: schema.nullable(schema.string()),
              createdAt: schema.string(),
              updatedAt: schema.string(),
              apiKey: schema.nullable(schema.string()),
              apiKeyOwner: schema.nullable(schema.string()),
              apiKeyCreatedByUser: schema.maybe(schema.nullable(schema.boolean())),
              throttle: schema.maybe(schema.nullable(schema.string())),
              notifyWhen: schema.maybe(schema.nullable(schema.any())),
              muteAll: schema.boolean(),
              mutedInstanceIds: schema.arrayOf(schema.string()),
              meta: schema.maybe(schema.any()),
              executionStatus: schema.any(),
              monitoring: schema.maybe(schema.any()),
              snoozeSchedule: schema.maybe(schema.arrayOf(schema.any())),
              isSnoozedUntil: schema.maybe(schema.nullable(schema.string())),
              lastRun: schema.maybe(schema.nullable(schema.any())),
              nextRun: schema.maybe(schema.nullable(schema.string())),
              revision: schema.number(),
              running: schema.maybe(schema.nullable(schema.boolean())),
            },
            { unknowns: 'ignore' } // note the `unknown: ignore` which is how we're evicting the unknown fields
          ),
        },
      },
    },
    management: {
      displayName: 'rule',
      importableAndExportable: true,
      getTitle(ruleSavedObject: SavedObject<RawRule>) {
        return `Rule: [${ruleSavedObject.attributes.name}]`;
      },
      onImport(ruleSavedObjects) {
        return {
          warnings: getImportWarnings(ruleSavedObjects),
        };
      },
      onExport<RawRule>(
        context: SavedObjectsExportTransformContext,
        objects: Array<SavedObject<RawRule>>
      ) {
        return transformRulesForExport(objects);
      },
      isExportable<RawRule>(ruleSavedObject: SavedObject<RawRule>) {
        return isRuleExportable(ruleSavedObject, ruleTypeRegistry, logger);
      },
    },
  });

  savedObjects.registerType({
    name: 'api_key_pending_invalidation',
    indexPattern: ALERTING_CASES_SAVED_OBJECT_INDEX,
    hidden: true,
    namespaceType: 'agnostic',
    mappings: {
      properties: {
        apiKeyId: {
          type: 'keyword',
        },
        createdAt: {
          type: 'date',
        },
      },
    },
  });

  savedObjects.registerType({
    name: RULES_SETTINGS_SAVED_OBJECT_TYPE,
    indexPattern: ALERTING_CASES_SAVED_OBJECT_INDEX,
    hidden: true,
    namespaceType: 'single',
    mappings: rulesSettingsMappings,
  });

  savedObjects.registerType({
    name: MAINTENANCE_WINDOW_SAVED_OBJECT_TYPE,
    indexPattern: ALERTING_CASES_SAVED_OBJECT_INDEX,
    hidden: true,
    namespaceType: 'multiple-isolated',
    mappings: maintenanceWindowMappings,
  });

  // Encrypted attributes
  encryptedSavedObjects.registerType({
    type: 'alert',
    attributesToEncrypt: new Set(['apiKey']),
    attributesToIncludeInAAD: new Set(AlertAttributesIncludedInAAD),
  });

  // Encrypted attributes
  encryptedSavedObjects.registerType({
    type: 'api_key_pending_invalidation',
    attributesToEncrypt: new Set(['apiKeyId']),
  });
}
