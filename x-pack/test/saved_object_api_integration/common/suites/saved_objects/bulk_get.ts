/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import expect from 'expect.js';
import { DEFAULT_SPACE_ID } from '../../../../../plugins/spaces/common/constants';
import { getIdPrefix, getUrlPrefix } from '../../../common/lib/space_test_utils';

interface Authentication {
  username: string;
  password: string;
}

interface BulkGetTest {
  statusCode: number;
  response: (resp: any) => void;
}

interface BulkGetTests {
  default: BulkGetTest;
}

interface BulkGetTestDefinition {
  auth?: Authentication;
  spaceId?: string;
  otherSpaceId?: string;
  tests: BulkGetTests;
}

type DescribeFn = (description: string, fn: () => void) => void;

export function bulkGetTestSuiteFactory(esArchiver: any, supertest: any) {
  const makeBulkGetTest = (describeFn: DescribeFn) => (
    description: string,
    definition: BulkGetTestDefinition
  ) => {
    const {
      auth = {
        username: undefined,
        password: undefined,
      },
      spaceId,
      otherSpaceId,
      tests,
    } = definition;

    const BULK_REQUESTS = [
      {
        type: 'visualization',
        id: 'dd7caf20-9efd-11e7-acb3-3dab96693fab',
      },
      {
        type: 'dashboard',
        id: 'does not exist',
      },
    ];

    const createBulkRequests = (requestSpaceId: string) =>
      BULK_REQUESTS.map(r => ({
        ...r,
        id: `${getIdPrefix(requestSpaceId)}${r.id}`,
      }));

    describeFn(description, () => {
      before(() => esArchiver.load('saved_objects/spaces'));
      after(() => esArchiver.unload('saved_objects/spaces'));

      it(`should return ${tests.default.statusCode}`, async () => {
        await supertest
          .post(`${getUrlPrefix(spaceId || DEFAULT_SPACE_ID)}/api/saved_objects/_bulk_get`)
          .auth(auth.username, auth.password)
          .send(createBulkRequests(otherSpaceId || spaceId || DEFAULT_SPACE_ID))
          .expect(tests.default.statusCode)
          .then(tests.default.response);
      });
    });
  };

  const createExpectLegacyForbidden = (username: string) => (resp: any) => {
    expect(resp.body).to.eql({
      statusCode: 403,
      error: 'Forbidden',
      // eslint-disable-next-line max-len
      message: `action [indices:data/read/mget] is unauthorized for user [${username}]: [security_exception] action [indices:data/read/mget] is unauthorized for user [${username}]`,
    });
  };

  const expectRbacForbidden = (resp: any) => {
    expect(resp.body).to.eql({
      statusCode: 403,
      error: 'Forbidden',
      message: `Unable to bulk_get dashboard,visualization, missing action:saved_objects/dashboard/bulk_get,action:saved_objects/visualization/bulk_get`,
    });
  };

  const createExpectNotFoundResults = (spaceId: string) => (resp: any) => {
    expect(resp.body).to.eql({
      saved_objects: [
        {
          id: `${getIdPrefix(spaceId)}dd7caf20-9efd-11e7-acb3-3dab96693fab`,
          type: 'visualization',
          error: {
            statusCode: 404,
            message: 'Not found',
          },
        },
        {
          id: `${getIdPrefix(spaceId)}does not exist`,
          type: 'dashboard',
          error: {
            statusCode: 404,
            message: 'Not found',
          },
        },
      ],
    });
  };

  const createExpectResults = (spaceId = DEFAULT_SPACE_ID) => (resp: any) => {
    expect(resp.body).to.eql({
      saved_objects: [
        {
          id: `${getIdPrefix(spaceId)}dd7caf20-9efd-11e7-acb3-3dab96693fab`,
          type: 'visualization',
          updated_at: '2017-09-21T18:51:23.794Z',
          version: resp.body.saved_objects[0].version,
          attributes: {
            title: 'Count of requests',
            description: '',
            version: 1,
            // cheat for some of the more complex attributes
            visState: resp.body.saved_objects[0].attributes.visState,
            uiStateJSON: resp.body.saved_objects[0].attributes.uiStateJSON,
            kibanaSavedObjectMeta: resp.body.saved_objects[0].attributes.kibanaSavedObjectMeta,
          },
        },
        {
          id: `${getIdPrefix(spaceId)}does not exist`,
          type: 'dashboard',
          error: {
            statusCode: 404,
            message: 'Not found',
          },
        },
      ],
    });
  };

  const bulkGetTest = makeBulkGetTest(describe);
  bulkGetTest.only = makeBulkGetTest(describe.only);

  return {
    bulkGetTest,
    createExpectLegacyForbidden,
    createExpectNotFoundResults,
    createExpectResults,
    expectRbacForbidden,
  };
}
