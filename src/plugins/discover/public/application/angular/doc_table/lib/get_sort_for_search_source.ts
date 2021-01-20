/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * and the Server Side Public License, v 1; you may not use this file except in
 * compliance with, at your election, the Elastic License or the Server Side
 * Public License, v 1.
 */

import { EsQuerySortValue, IndexPattern } from '../../../../kibana_services';
import { SortOrder } from '../components/table_header/helpers';
import { getSort } from './get_sort';
import { getDefaultSort } from './get_default_sort';

/**
 * Prepares sort for search source, that's sending the request to ES
 * - Adds default sort if necessary
 * - Handles the special case when there's sorting by date_nanos typed fields
 *   the addon of the numeric_type guarantees the right sort order
 *   when there are indices with date and indices with date_nanos field
 */
export function getSortForSearchSource(
  sort?: SortOrder[],
  indexPattern?: IndexPattern,
  defaultDirection: string = 'desc'
): EsQuerySortValue[] {
  if (!sort || !indexPattern) {
    return [];
  } else if (Array.isArray(sort) && sort.length === 0) {
    sort = getDefaultSort(indexPattern, defaultDirection);
  }
  const { timeFieldName } = indexPattern;
  return getSort(sort, indexPattern).map((sortPair: Record<string, string>) => {
    if (indexPattern.isTimeNanosBased() && timeFieldName && sortPair[timeFieldName]) {
      return {
        [timeFieldName]: {
          order: sortPair[timeFieldName],
          numeric_type: 'date_nanos',
        },
      } as EsQuerySortValue;
    }
    return sortPair as EsQuerySortValue;
  });
}
