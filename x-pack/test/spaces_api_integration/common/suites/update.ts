/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import expect from 'expect.js';
import { SuperTest } from 'supertest';
import { getUrlPrefix } from '../lib/space_test_utils';
import { DescribeFn, TestOptions } from '../lib/types';

export function updateTestSuiteFactory(esArchiver: any, supertest: SuperTest<any>) {
  const makeUpdateTest = (describeFn: DescribeFn) => (
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

  const createExpectForbiddenResult = () => (resp: any) => {
    expect(resp.body).to.eql({
      statusCode: 403,
      error: 'Forbidden',
      message: 'Unauthorized to update spaces',
    });
  };

  const createExpectLegacyForbiddenResult = () => (resp: any) => {
    expect(resp.body).to.eql({
      statusCode: 403,
      error: 'Forbidden',
      message: `action [indices:data/write/update] is unauthorized for user [a_kibana_legacy_dashboard_only_user]: [security_exception] action [indices:data/write/update] is unauthorized for user [a_kibana_legacy_dashboard_only_user]`,
    });
  };

  return {
    updateTest,
    createExpectResult,
    createExpectNotFoundResult,
    createExpectForbiddenResult,
    createExpectLegacyForbiddenResult,
  };
}
