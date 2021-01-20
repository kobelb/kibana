/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * and the Server Side Public License, v 1; you may not use this file except in
 * compliance with, at your election, the Elastic License or the Server Side
 * Public License, v 1.
 */

import type { PublicMethodsOf } from '@kbn/utility-types';

import { KibanaMigrator, KibanaMigratorStatus } from './kibana_migrator';
import { buildActiveMappings } from '../core';
const { mergeTypes } = jest.requireActual('./kibana_migrator');
import { SavedObjectsType } from '../../types';
import { BehaviorSubject } from 'rxjs';

const defaultSavedObjectTypes: SavedObjectsType[] = [
  {
    name: 'testtype',
    hidden: false,
    namespaceType: 'single',
    mappings: {
      properties: {
        name: { type: 'keyword' },
      },
    },
    migrations: {},
  },
];

const createMigrator = (
  {
    types,
  }: {
    types: SavedObjectsType[];
  } = { types: defaultSavedObjectTypes }
) => {
  const mockMigrator: jest.Mocked<PublicMethodsOf<KibanaMigrator>> = {
    runMigrations: jest.fn(),
    getActiveMappings: jest.fn(),
    migrateDocument: jest.fn(),
    getStatus$: jest.fn(
      () =>
        new BehaviorSubject<KibanaMigratorStatus>({
          status: 'completed',
          result: [
            {
              status: 'migrated',
              destIndex: '.test-kibana_2',
              sourceIndex: '.test-kibana_1',
              elapsedMs: 10,
            },
          ],
        })
    ),
  };

  mockMigrator.getActiveMappings.mockReturnValue(buildActiveMappings(mergeTypes(types)));
  mockMigrator.migrateDocument.mockImplementation((doc) => doc);
  return mockMigrator;
};

export const mockKibanaMigrator = {
  create: createMigrator,
};
