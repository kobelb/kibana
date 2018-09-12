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

import { SavedObjectsRepositoryProvider } from './repository_provider';

test('requires "callCluster" to be provided', () => {
  const provider = new SavedObjectsRepositoryProvider({
    index: 'idx',
    mappings: {
      foo: {}
    },
    onBeforeWrite: jest.fn()
  });

  expect(() => provider.getRepository({})).toThrowErrorMatchingSnapshot();
});

test('creates a valid Repository', async () => {
  const properties = {
    index: 'default-index',
    mappings: {
      foo: {
        properties: {
          field: { type: 'string' }
        }
      }
    },
    schema: {
      isNamespaceAgnostic: jest.fn(),
    },
    onBeforeWrite: jest.fn()
  };

  const provider = new SavedObjectsRepositoryProvider(properties);

  const callCluster = jest.fn().mockReturnValue({
    _id: 'ns:foo:new'
  });

  const repository = provider.getRepository(callCluster);

  await repository.create('foo', {}, { namespace: 'ns' });

  expect(callCluster).toHaveBeenCalledTimes(1);
  expect(properties.schema.isNamespaceAgnostic).toHaveBeenCalled();
  expect(properties.onBeforeWrite).toHaveBeenCalledTimes(1);
  expect(callCluster).toHaveBeenCalledWith('index', expect.objectContaining({
    index: properties.index
  }));
});
