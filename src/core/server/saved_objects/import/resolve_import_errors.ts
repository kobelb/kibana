/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * and the Server Side Public License, v 1; you may not use this file except in
 * compliance with, at your election, the Elastic License or the Server Side
 * Public License, v 1.
 */

import { collectSavedObjects } from './collect_saved_objects';
import { createObjectsFilter } from './create_objects_filter';
import { splitOverwrites } from './split_overwrites';
import {
  SavedObjectsImportError,
  SavedObjectsImportResponse,
  SavedObjectsResolveImportErrorsOptions,
  SavedObjectsImportSuccess,
} from './types';
import { regenerateIds } from './regenerate_ids';
import { validateReferences } from './validate_references';
import { validateRetries } from './validate_retries';
import { createSavedObjects } from './create_saved_objects';
import { getImportIdMapForRetries } from './check_origin_conflicts';
import { SavedObject } from '../types';
import { checkConflicts } from './check_conflicts';

/**
 * Resolve and return saved object import errors.
 * See the {@link SavedObjectsResolveImportErrorsOptions | options} for more detailed informations.
 *
 * @public
 */
export async function resolveSavedObjectsImportErrors({
  readStream,
  objectLimit,
  retries,
  savedObjectsClient,
  typeRegistry,
  namespace,
  createNewCopies,
}: SavedObjectsResolveImportErrorsOptions): Promise<SavedObjectsImportResponse> {
  // throw a BadRequest error if we see invalid retries
  validateRetries(retries);

  let successCount = 0;
  let errorAccumulator: SavedObjectsImportError[] = [];
  let importIdMap: Map<string, { id?: string; omitOriginId?: boolean }> = new Map();
  const supportedTypes = typeRegistry.getImportableAndExportableTypes().map((type) => type.name);
  const filter = createObjectsFilter(retries);

  // Get the objects to resolve errors
  const { errors: collectorErrors, collectedObjects: objectsToResolve } = await collectSavedObjects(
    {
      readStream,
      objectLimit,
      filter,
      supportedTypes,
    }
  );
  errorAccumulator = [...errorAccumulator, ...collectorErrors];

  // Create a map of references to replace for each object to avoid iterating through
  // retries for every object to resolve
  const retriesReferencesMap = new Map<string, { [key: string]: string }>();
  for (const retry of retries) {
    const map: { [key: string]: string } = {};
    for (const { type, from, to } of retry.replaceReferences) {
      map[`${type}:${from}`] = to;
    }
    retriesReferencesMap.set(`${retry.type}:${retry.id}`, map);
  }

  // Replace references
  for (const savedObject of objectsToResolve) {
    const refMap = retriesReferencesMap.get(`${savedObject.type}:${savedObject.id}`);
    if (!refMap) {
      continue;
    }
    for (const reference of savedObject.references || []) {
      if (refMap[`${reference.type}:${reference.id}`]) {
        reference.id = refMap[`${reference.type}:${reference.id}`];
      }
    }
  }

  // Validate references
  const validateReferencesResult = await validateReferences(
    objectsToResolve,
    savedObjectsClient,
    namespace,
    retries
  );
  errorAccumulator = [...errorAccumulator, ...validateReferencesResult];

  if (createNewCopies) {
    // In case any missing reference errors were resolved, ensure that we regenerate those object IDs as well
    // This is because a retry to resolve a missing reference error may not necessarily specify a destinationId
    importIdMap = regenerateIds(objectsToResolve);
  }

  // Check single-namespace objects for conflicts in this namespace, and check multi-namespace objects for conflicts across all namespaces
  const checkConflictsParams = {
    objects: objectsToResolve,
    savedObjectsClient,
    namespace,
    retries,
    createNewCopies,
  };
  const checkConflictsResult = await checkConflicts(checkConflictsParams);
  errorAccumulator = [...errorAccumulator, ...checkConflictsResult.errors];

  // Check multi-namespace object types for regular conflicts and ambiguous conflicts
  const getImportIdMapForRetriesParams = {
    objects: checkConflictsResult.filteredObjects,
    retries,
    createNewCopies,
  };
  const importIdMapForRetries = getImportIdMapForRetries(getImportIdMapForRetriesParams);
  importIdMap = new Map([
    ...importIdMap,
    ...importIdMapForRetries,
    ...checkConflictsResult.importIdMap, // this importIdMap takes precedence over the others
  ]);

  // Bulk create in two batches, overwrites and non-overwrites
  let successResults: SavedObjectsImportSuccess[] = [];
  const accumulatedErrors = [...errorAccumulator];
  const bulkCreateObjects = async (
    objects: Array<SavedObject<{ title?: string }>>,
    overwrite?: boolean
  ) => {
    const createSavedObjectsParams = {
      objects,
      accumulatedErrors,
      savedObjectsClient,
      importIdMap,
      namespace,
      overwrite,
    };
    const { createdObjects, errors: bulkCreateErrors } = await createSavedObjects(
      createSavedObjectsParams
    );
    errorAccumulator = [...errorAccumulator, ...bulkCreateErrors];
    successCount += createdObjects.length;
    successResults = [
      ...successResults,
      ...createdObjects.map((createdObject) => {
        const { type, id, destinationId, originId } = createdObject;
        const getTitle = typeRegistry.getType(type)?.management?.getTitle;
        const meta = {
          title: getTitle ? getTitle(createdObject) : createdObject.attributes.title,
          icon: typeRegistry.getType(type)?.management?.icon,
        };
        return {
          type,
          id,
          meta,
          ...(overwrite && { overwrite }),
          ...(destinationId && { destinationId }),
          ...(destinationId && !originId && !createNewCopies && { createNewCopy: true }),
        };
      }),
    ];
  };
  const { objectsToOverwrite, objectsToNotOverwrite } = splitOverwrites(objectsToResolve, retries);
  await bulkCreateObjects(objectsToOverwrite, true);
  await bulkCreateObjects(objectsToNotOverwrite);

  const errorResults = errorAccumulator.map((error) => {
    const icon = typeRegistry.getType(error.type)?.management?.icon;
    const attemptedOverwrite = retries.some(
      ({ type, id, overwrite }) => type === error.type && id === error.id && overwrite
    );
    return {
      ...error,
      meta: { ...error.meta, icon },
      ...(attemptedOverwrite && { overwrite: true }),
    };
  });

  return {
    successCount,
    success: errorAccumulator.length === 0,
    ...(successResults.length && { successResults }),
    ...(errorResults.length && { errors: errorResults }),
  };
}
