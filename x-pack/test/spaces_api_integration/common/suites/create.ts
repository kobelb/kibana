/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import expect from 'expect.js';
import { SuperTest } from 'supertest';
import { getUrlPrefix } from '../lib/space_test_utils';
import { DescribeFn, TestOptions } from '../lib/types';

export function createTestSuiteFactory(esArchiver: any, supertest: SuperTest<any>) {
  const makeCreateTest = (describeFn: DescribeFn) => (
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

      it(`should return ${tests.newSpace.statusCode}`, async () => {
        return supertest
          .post(`${getUrlPrefix(spaceId)}/api/spaces/v1/space`)
          .auth(auth.username, auth.password)
          .send(tests.newSpace.space)
          .expect(tests.newSpace.statusCode)
          .then(tests.newSpace.response);
      });

      describe('when it already exists', () => {
        it(`should return ${tests.alreadyExists.statusCode}`, async () => {
          return supertest
            .post(`${getUrlPrefix(spaceId)}/api/spaces/v1/space`)
            .auth(auth.username, auth.password)
            .send({
              name: 'space_1',
              id: 'space_1',
              color: '#ffffff',
              description: 'a description',
            })
            .expect(tests.alreadyExists.statusCode)
            .then(tests.alreadyExists.response);
        });
      });

      describe('when _reserved is specified', () => {
        it(`should return ${tests.reservedSpecified.statusCode} and ignore _reserved`, async () => {
          return supertest
            .post(`${getUrlPrefix(spaceId)}/api/spaces/v1/space`)
            .auth(auth.username, auth.password)
            .send(tests.reservedSpecified.space)
            .expect(tests.reservedSpecified.statusCode)
            .then(tests.reservedSpecified.response);
        });
      });
    });
  };

  const createTest = makeCreateTest(describe);

  const createExpectResult = (expectedResult: any) => (resp: any) => {
    expect(resp.body).to.eql(expectedResult);
  };

  const createExpectConflictResponse = () => (resp: any) => {
    const spaceId = 'space_1';
    expect(resp.body).to.only.have.keys(['error', 'message', 'statusCode']);
    expect(resp.body.error).to.equal('Conflict');
    expect(resp.body.statusCode).to.equal(409);
    expect(resp.body.message).to.match(
      new RegExp(`\\[doc]\\[space:${spaceId}]: version conflict, document already exists.*`)
    );
  };

  const createExpectForbiddenResponse = () => (resp: any) => {
    expect(resp.body).to.eql({
      statusCode: 403,
      error: 'Forbidden',
      message: 'Unauthorized to create spaces',
    });
  };

  const createExpectLegacyForbiddenResponse = () => (resp: any) => {
    expect(resp.body).to.eql({
      statusCode: 403,
      error: 'Forbidden',
      message: `action [indices:data/write/index] is unauthorized for user [a_kibana_legacy_dashboard_only_user]: [security_exception] action [indices:data/write/index] is unauthorized for user [a_kibana_legacy_dashboard_only_user]`,
    });
  };

  return {
    createTest,
    createExpectResult,
    createExpectConflictResponse,
    createExpectForbiddenResponse,
    createExpectLegacyForbiddenResponse,
  };
}
