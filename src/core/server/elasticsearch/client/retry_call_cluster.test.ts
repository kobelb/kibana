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

import { errors } from '@elastic/elasticsearch';
import { elasticsearchClientMock } from './mocks';
import { loggingSystemMock } from '../../logging/logging_system.mock';
import { retryCallCluster, migrationRetryCallCluster } from './retry_call_cluster';

const dummyBody = { foo: 'bar' };
const createErrorReturn = (err: any) => elasticsearchClientMock.createClientError(err);

describe('retryCallCluster', () => {
  let client: ReturnType<typeof elasticsearchClientMock.createElasticSearchClient>;

  beforeEach(() => {
    client = elasticsearchClientMock.createElasticSearchClient();
  });

  it('returns response from ES API call in case of success', async () => {
    const successReturn = elasticsearchClientMock.createClientResponse({ ...dummyBody });

    client.asyncSearch.get.mockReturnValue(successReturn);

    const result = await retryCallCluster(() => client.asyncSearch.get());
    expect(result.body).toEqual(dummyBody);
  });

  it('retries ES API calls that rejects with `NoLivingConnectionsError`', async () => {
    const successReturn = elasticsearchClientMock.createClientResponse({ ...dummyBody });

    client.asyncSearch.get
      .mockImplementationOnce(() =>
        createErrorReturn(new errors.NoLivingConnectionsError('no living connections', {} as any))
      )
      .mockImplementationOnce(() => successReturn);

    const result = await retryCallCluster(() => client.asyncSearch.get());
    expect(result.body).toEqual(dummyBody);
  });

  it('rejects when ES API calls reject with other errors', async () => {
    client.ping
      .mockImplementationOnce(() => createErrorReturn(new Error('unknown error')))
      .mockImplementationOnce(() => elasticsearchClientMock.createClientResponse({ ...dummyBody }));

    await expect(retryCallCluster(() => client.ping())).rejects.toMatchInlineSnapshot(
      `[Error: unknown error]`
    );
  });

  it('stops retrying when ES API calls reject with other errors', async () => {
    client.ping
      .mockImplementationOnce(() =>
        createErrorReturn(new errors.NoLivingConnectionsError('no living connections', {} as any))
      )
      .mockImplementationOnce(() =>
        createErrorReturn(new errors.NoLivingConnectionsError('no living connections', {} as any))
      )
      .mockImplementationOnce(() => createErrorReturn(new Error('unknown error')))
      .mockImplementationOnce(() => elasticsearchClientMock.createClientResponse({ ...dummyBody }));

    await expect(retryCallCluster(() => client.ping())).rejects.toMatchInlineSnapshot(
      `[Error: unknown error]`
    );
  });
});

describe('migrationRetryCallCluster', () => {
  let client: ReturnType<typeof elasticsearchClientMock.createElasticSearchClient>;
  let logger: ReturnType<typeof loggingSystemMock.createLogger>;

  beforeEach(() => {
    client = elasticsearchClientMock.createElasticSearchClient();
    logger = loggingSystemMock.createLogger();
  });

  const mockClientPingWithErrorBeforeSuccess = (error: any) => {
    client.ping
      .mockImplementationOnce(() => createErrorReturn(error))
      .mockImplementationOnce(() => createErrorReturn(error))
      .mockImplementationOnce(() => elasticsearchClientMock.createClientResponse({ ...dummyBody }));
  };

  it('retries ES API calls that rejects with `NoLivingConnectionsError`', async () => {
    mockClientPingWithErrorBeforeSuccess(
      new errors.NoLivingConnectionsError('no living connections', {} as any)
    );

    const result = await migrationRetryCallCluster(() => client.ping(), logger, 1);
    expect(result.body).toEqual(dummyBody);
  });

  it('retries ES API calls that rejects with `ConnectionError`', async () => {
    mockClientPingWithErrorBeforeSuccess(new errors.ConnectionError('connection error', {} as any));

    const result = await migrationRetryCallCluster(() => client.ping(), logger, 1);
    expect(result.body).toEqual(dummyBody);
  });

  it('retries ES API calls that rejects with `TimeoutError`', async () => {
    mockClientPingWithErrorBeforeSuccess(new errors.TimeoutError('timeout error', {} as any));

    const result = await migrationRetryCallCluster(() => client.ping(), logger, 1);
    expect(result.body).toEqual(dummyBody);
  });

  it('retries ES API calls that rejects with 503 `ResponseError`', async () => {
    mockClientPingWithErrorBeforeSuccess(
      new errors.ResponseError({
        statusCode: 503,
      } as any)
    );

    const result = await migrationRetryCallCluster(() => client.ping(), logger, 1);
    expect(result.body).toEqual(dummyBody);
  });

  it('retries ES API calls that rejects 401 `ResponseError`', async () => {
    mockClientPingWithErrorBeforeSuccess(
      new errors.ResponseError({
        statusCode: 401,
      } as any)
    );

    const result = await migrationRetryCallCluster(() => client.ping(), logger, 1);
    expect(result.body).toEqual(dummyBody);
  });

  it('retries ES API calls that rejects with 403 `ResponseError`', async () => {
    mockClientPingWithErrorBeforeSuccess(
      new errors.ResponseError({
        statusCode: 403,
      } as any)
    );

    const result = await migrationRetryCallCluster(() => client.ping(), logger, 1);
    expect(result.body).toEqual(dummyBody);
  });

  it('retries ES API calls that rejects with 408 `ResponseError`', async () => {
    mockClientPingWithErrorBeforeSuccess(
      new errors.ResponseError({
        statusCode: 408,
      } as any)
    );

    const result = await migrationRetryCallCluster(() => client.ping(), logger, 1);
    expect(result.body).toEqual(dummyBody);
  });

  it('retries ES API calls that rejects with 410 `ResponseError`', async () => {
    mockClientPingWithErrorBeforeSuccess(
      new errors.ResponseError({
        statusCode: 410,
      } as any)
    );

    const result = await migrationRetryCallCluster(() => client.ping(), logger, 1);
    expect(result.body).toEqual(dummyBody);
  });

  it('retries ES API calls that rejects with `snapshot_in_progress_exception` `ResponseError`', async () => {
    mockClientPingWithErrorBeforeSuccess(
      new errors.ResponseError({
        statusCode: 500,
        body: {
          error: {
            type: 'snapshot_in_progress_exception',
          },
        },
      } as any)
    );

    const result = await migrationRetryCallCluster(() => client.ping(), logger, 1);
    expect(result.body).toEqual(dummyBody);
  });

  it('logs only once for each unique error message', async () => {
    client.ping
      .mockImplementationOnce(() =>
        createErrorReturn(
          new errors.ResponseError({
            statusCode: 503,
          } as any)
        )
      )
      .mockImplementationOnce(() =>
        createErrorReturn(new errors.ConnectionError('connection error', {} as any))
      )
      .mockImplementationOnce(() =>
        createErrorReturn(
          new errors.ResponseError({
            statusCode: 503,
          } as any)
        )
      )
      .mockImplementationOnce(() =>
        createErrorReturn(new errors.ConnectionError('connection error', {} as any))
      )
      .mockImplementationOnce(() =>
        createErrorReturn(
          new errors.ResponseError({
            statusCode: 500,
            body: {
              error: {
                type: 'snapshot_in_progress_exception',
              },
            },
          } as any)
        )
      )
      .mockImplementationOnce(() => elasticsearchClientMock.createClientResponse({ ...dummyBody }));

    await migrationRetryCallCluster(() => client.ping(), logger, 1);

    expect(loggingSystemMock.collect(logger).warn).toMatchInlineSnapshot(`
      Array [
        Array [
          "Unable to connect to Elasticsearch. Error: Response Error",
        ],
        Array [
          "Unable to connect to Elasticsearch. Error: connection error",
        ],
        Array [
          "Unable to connect to Elasticsearch. Error: snapshot_in_progress_exception",
        ],
      ]
    `);
  });

  it('rejects when ES API calls reject with other errors', async () => {
    client.ping
      .mockImplementationOnce(() =>
        createErrorReturn(
          new errors.ResponseError({
            statusCode: 418,
            body: {
              error: {
                type: `I'm a teapot`,
              },
            },
          } as any)
        )
      )
      .mockImplementationOnce(() => elasticsearchClientMock.createClientResponse({ ...dummyBody }));

    await expect(
      migrationRetryCallCluster(() => client.ping(), logger, 1)
    ).rejects.toMatchInlineSnapshot(`[ResponseError: I'm a teapot]`);
  });

  it('stops retrying when ES API calls reject with other errors', async () => {
    client.ping
      .mockImplementationOnce(() =>
        createErrorReturn(new errors.TimeoutError('timeout error', {} as any))
      )
      .mockImplementationOnce(() =>
        createErrorReturn(new errors.TimeoutError('timeout error', {} as any))
      )
      .mockImplementationOnce(() => createErrorReturn(new Error('unknown error')))
      .mockImplementationOnce(() => elasticsearchClientMock.createClientResponse({ ...dummyBody }));

    await expect(
      migrationRetryCallCluster(() => client.ping(), logger, 1)
    ).rejects.toMatchInlineSnapshot(`[Error: unknown error]`);
  });
});
