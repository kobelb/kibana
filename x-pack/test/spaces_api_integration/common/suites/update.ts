/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import expect from 'expect.js';
import { SuperTest } from 'supertest';
import { getUrlPrefix } from '../lib/space_test_utils';
import { DescribeFn, TestDefinitionAuthentication } from '../lib/types';

interface UpdateTest {
  statusCode: number;
  space: any;
  response: (resp: any) => void;
}

interface UpdateTests {
  alreadyExists: UpdateTest;
  newSpace: UpdateTest;
}

interface UpdateTestDefinition {
  auth?: TestDefinitionAuthentication;
  spaceId: string;
  tests: UpdateTests;
}

export function updateTestSuiteFactory(esArchiver: any, supertest: SuperTest<any>) {
  const makeUpdateTest = (describeFn: DescribeFn) => (
    description: string,
    { auth = {}, spaceId, tests }: UpdateTestDefinition
  ) => {
    describeFn(description, () => {
      before(() => esArchiver.load('saved_objects/spaces'));
      after(() => esArchiver.unload('saved_objects/spaces'));

      it(`should return ${tests.alreadyExists.statusCode}`, async () => {
        return supertest
          .put(`${getUrlPrefix(spaceId)}/api/spaces/v1/space/${tests.alreadyExists.space.id}`)
          .auth(auth.username, auth.password)
          .send(tests.alreadyExists.space)
          .expect(tests.alreadyExists.statusCode)
          .then(tests.alreadyExists.response);
      });

      describe(`when space doesn't exist`, () => {
        it(`should return ${tests.newSpace.statusCode}`, async () => {
          return supertest
            .put(`${getUrlPrefix(spaceId)}/api/spaces/v1/space/${tests.newSpace.space.id}`)
            .auth(auth.username, auth.password)
            .send(tests.newSpace.space)
            .expect(tests.newSpace.statusCode)
            .then(tests.newSpace.response);
        });
      });
    });
  };

  const updateTest = makeUpdateTest(describe);

  const createExpectResult = (expectedResult: any) => (resp: any) => {
    expect(resp.body).to.eql(expectedResult);
  };

  const createExpectNotFoundResult = (spaceId: string) => (resp: any) => {
    expect(resp.body).to.eql({
      error: 'Not Found',
      statusCode: 404,
      message: `Saved object [space/${spaceId}] not found`,
    });
  };

  const expectRbacForbiddenResult = (resp: any) => {
    expect(resp.body).to.eql({
      statusCode: 403,
      error: 'Forbidden',
      message: 'Unauthorized to update spaces',
    });
  };

  const createExpectLegacyForbiddenResult = (username: string) => (resp: any) => {
    expect(resp.body).to.eql({
      statusCode: 403,
      error: 'Forbidden',
      message: `action [indices:data/write/update] is unauthorized for user [${username}]: [security_exception] action [indices:data/write/update] is unauthorized for user [${username}]`,
    });
  };

  return {
    updateTest,
    createExpectResult,
    createExpectNotFoundResult,
    expectRbacForbiddenResult,
    createExpectLegacyForbiddenResult,
  };
}
