/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import expect from 'expect.js';
import { SuperTest } from 'supertest';
import { getUrlPrefix } from '../lib/space_test_utils';
import { DescribeFn, TestOptions } from '../lib/types';

export function deleteTestSuiteFactory(esArchiver: any, supertest: SuperTest<any>) {
  const makeDeleteTest = (describeFn: DescribeFn) => (
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
          .delete(`${getUrlPrefix(spaceId)}/api/spaces/v1/space/space_2`)
          .auth(auth.username, auth.password)
          .expect(tests.exists.statusCode)
          .then(tests.exists.response);
      });

      describe(`when the space is reserved`, async () => {
        it(`should return ${tests.reservedSpace.statusCode}`, async () => {
          return supertest
            .delete(`${getUrlPrefix(spaceId)}/api/spaces/v1/space/default`)
            .auth(auth.username, auth.password)
            .expect(tests.reservedSpace.statusCode)
            .then(tests.reservedSpace.response);
        });
      });

      describe(`when the space doesn't exist`, () => {
        it(`should return ${tests.doesntExist.statusCode}`, async () => {
          return supertest
            .delete(`${getUrlPrefix(spaceId)}/api/spaces/v1/space/space_3`)
            .auth(auth.username, auth.password)
            .expect(tests.doesntExist.statusCode)
            .then(tests.doesntExist.response);
        });
      });
    });
  };

  const deleteTest = makeDeleteTest(describe);

  const createExpectResult = (expectedResult: any) => (resp: any) => {
    expect(resp.body).to.eql(expectedResult);
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

  const createExpectLegacyForbiddenResult = () => (resp: any) => {
    expect(resp.body).to.eql({
      statusCode: 403,
      error: 'Forbidden',
      message: `action [indices:data/write/delete] is unauthorized for user [a_kibana_legacy_dashboard_only_user]: [security_exception] action [indices:data/write/delete] is unauthorized for user [a_kibana_legacy_dashboard_only_user]`,
    });
  };

  return {
    deleteTest,
    createExpectResult,
    createExpectForbiddenResult,
    createExpectEmptyResult,
    createExpectNotFoundResult,
    createExpectReservedSpaceResult,
    createExpectLegacyForbiddenResult,
  };
}
