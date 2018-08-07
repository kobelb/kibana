/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { getRootPropertiesObjects } from '../../../../mappings';

/**
 * Gets the types based on the type. Uses mappings to support
 * null type (all types), a single type string or an array
 * @param {EsMapping} mappings
 * @param {(string|Array<string>)} type
 */
function getTypes(mappings, type) {
  if (!type) {
    return Object.keys(getRootPropertiesObjects(mappings));
  }

  if (Array.isArray(type)) {
    return type;
  }

  return [type];
}

/**
 *  Get the field params based on the types and searchFields
 *  @param  {Array<string>} searchFields
 *  @param  {string|Array<string>} types
 *  @return {Object}
 */
function getFieldsForTypes(searchFields, types) {

  if (!searchFields || !searchFields.length) {
    return {
      all_fields: true
    };
  }

  return {
    fields: searchFields.reduce((acc, field) => [
      ...acc,
      ...types.map(prefix => `${prefix}.${field}`)
    ], []),
  };
}

/**
 *  Get the "query" related keys for the search body
 *  @param  {EsMapping} mapping mappings from Ui
 *  @param  {(string|Array<string>)} type
 *  @param  {String} search
 *  @param  {Array<string>} searchFields
 *  @param {Array<object>} filters additional query filters
 *  @return {Object}
 */
export function getQueryParams(mappings, documentFormat, type, search, searchFields, filters = []) {

  const bool = {
    filter: [...filters],
  };

  if (type) {
    if (Array.isArray(type)) {
      bool.filter.push({
        terms: {
          type: type.map(t => documentFormat.toDocumentSourceType(t))
        }
      });
    } else {
      bool.filter.push({
        term: {
          type: documentFormat.toDocumentSourceType(type)
        }
      });
    }
  }

  if (search) {
    bool.must = [
      {
        simple_query_string: {
          query: search,
          ...getFieldsForTypes(
            searchFields,
            getTypes(mappings, type)
          )
        }
      }
    ];
  }

  // Don't construct a query if there is nothing to search on.
  if (bool.filter.length === 0 && !search) {
    return {};
  }

  console.log(JSON.stringify({
    query: { bool }
  }));

  return { query: { bool } };
}


