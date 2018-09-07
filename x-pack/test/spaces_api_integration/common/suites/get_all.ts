/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import expect from 'expect.js';
import { SuperTest } from 'supertest';
import { getUrlPrefix } from '../lib/space_test_utils';
import { DescribeFn, TestOptions } from '../lib/types';

export function getAllTestSuiteFactory(esArchiver: any, supertest: SuperTest<any>) {
  const makeGetAllTest = (describeFn: DescribeFn) => (
    description: string,
    {
      auth = {
        username: undefined,
        password: undefined,
      },
      spaceId,
      tests,
    }: TestOptions
  ) => {
    describeFn(description, () => {
      before(() => esArchiver.load('saved_objects/spaces'));
      after(() => esArchiver.unload('saved_objects/spaces'));

      it(`should return ${tests.exists.statusCode}`, async () => {
        return supertest
          .get(`${getUrlPrefix(spaceId)}/api/spaces/v1/spaces`)
          .auth(auth.username, auth.password)
          .expect(tests.exists.statusCode)
          .then(tests.exists.response);
      });
    });
  };

  const getAllTest = makeGetAllTest(describe);

  const createExpectResults = (...spaceIds: string[]) => (resp: any) => {
    const expectedBody = [
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
    ].filter(entry => spaceIds.includes(entry.id));
    expect(resp.body).to.eql(expectedBody);
  };

  const createExpectEmptyResult = () => (resp: any) => {
    expect(resp.body).to.eql('');
  };

  const createExpectNotFoundResult = () => (resp: any) => {
    expect(resp.body).to.eql({
      error: 'Not Found',
      statusCode: 404,
      message: `Saved object [space/space_3] not found`,
    });
  };

  const createExpectReservedSpaceResult = () => (resp: any) => {
    expect(resp.body).to.eql({
      error: 'Bad Request',
      statusCode: 400,
      message: `This Space cannot be deleted because it is reserved.`,
    });
  };

  const createExpectForbiddenResult = () => (resp: any) => {
    expect(resp.body).to.eql({
      statusCode: 403,
      error: 'Forbidden',
      message: 'Unauthorized to delete spaces',
    });
  };

  return {
    getAllTest,
    createExpectResults,
    createExpectForbiddenResult,
    createExpectEmptyResult,
    createExpectNotFoundResult,
    createExpectReservedSpaceResult,
  };
}
