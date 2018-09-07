/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import expect from 'expect.js';
import { SuperAgent } from 'superagent';
import { getUrlPrefix } from '../lib/space_test_utils';
import { DescribeFn, TestOptions } from '../lib/types';

export function getTestSuiteFactory(esArchiver: any, supertest: SuperAgent<any>) {
  const nonExistantSpaceId = 'not-a-space';

  const makeGetTest = (describeFn: DescribeFn) => (
    description: string,
    {
      auth = {
        username: undefined,
        password: undefined,
      },
      currentSpaceId,
      spaceId,
      tests,
    }: TestOptions
  ) => {
    describeFn(description, () => {
      before(() => esArchiver.load('saved_objects/spaces'));
      after(() => esArchiver.unload('saved_objects/spaces'));

      it(`should return ${tests.default.statusCode}`, async () => {
        return supertest
          .get(`${getUrlPrefix(currentSpaceId)}/api/spaces/v1/space/${spaceId}`)
          .auth(auth.username, auth.password)
          .expect(tests.default.statusCode)
          .then(tests.default.response);
      });
    });
  };

  const getTest = makeGetTest(describe);

  const createExpectResults = (spaceId: string) => (resp: any) => {
    const allSpaces = [
      {
        id: 'default',
        name: 'Default Space',
        description: 'This is the default space',
        _reserved: true,
      },
      {
        id: 'space_1',
        name: 'Space 1',
        description: 'This is the first test space',
      },
      {
        id: 'space_2',
        name: 'Space 2',
        description: 'This is the second test space',
      },
    ];
    expect(resp.body).to.eql(allSpaces.find(space => space.id === spaceId));
  };

  const createExpectEmptyResult = () => (resp: any) => {
    expect(resp.body).to.eql('');
  };

  const createExpectNotFoundResult = (spaceId: string) => (resp: any) => {
    expect(resp.body).to.eql({
      error: 'Not Found',
      statusCode: 404,
      message: `Saved object [space/${spaceId}] not found`,
    });
  };

  const createExpectReservedSpaceResult = () => (resp: any) => {
    expect(resp.body).to.eql({
      error: 'Bad Request',
      statusCode: 400,
      message: `This Space cannot be deleted because it is reserved.`,
    });
  };

  const createExpectForbiddenResult = (spaceId: string) => (resp: any) => {
    expect(resp.body).to.eql({
      statusCode: 403,
      error: 'Forbidden',
      message: `Unauthorized to get ${spaceId} space`,
    });
  };

  return {
    getTest,
    nonExistantSpaceId,
    createExpectResults,
    createExpectForbiddenResult,
    createExpectEmptyResult,
    createExpectNotFoundResult,
    createExpectReservedSpaceResult,
  };
}
