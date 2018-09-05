/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import expect from 'expect.js';
import { getIdPrefix, getUrlPrefix } from "../../lib/space_test_utils";
import { DEFAULT_SPACE_ID } from '../../../../../plugins/spaces/common/constants';

export function getTestSuiteFactory(esArchiver, supertest) {
  const existsId = 'dd7caf20-9efd-11e7-acb3-3dab96693fab';
  const doesntExistId = 'foobar';
  const makeGetTest = (describeFn) => (description, {
    auth = {
      username: undefined,
      password: undefined,
    },
    spaceId = DEFAULT_SPACE_ID,
    otherSpaceId = spaceId,
    tests
  }) => {
    describeFn(description, () => {
      before(() => esArchiver.load('saved_objects/spaces'));
      after(() => esArchiver.unload('saved_objects/spaces'));

      it(`should return ${tests.exists.statusCode}`, async () => {
        await supertest
          .get(`${getUrlPrefix(spaceId)}/api/saved_objects/visualization/${getIdPrefix(otherSpaceId)}${existsId}`)
          .auth(auth.username, auth.password)
          .expect(tests.exists.statusCode)
          .then(tests.exists.response);
      });

      describe('document does not exist', () => {
        it(`should return ${tests.doesntExist.statusCode}`, async () => {
          await supertest
            .get(`${getUrlPrefix(spaceId)}/api/saved_objects/visualization/${getIdPrefix(otherSpaceId)}${doesntExistId}`)
            .auth(auth.username, auth.password)
            .expect(tests.doesntExist.statusCode)
            .then(tests.doesntExist.response);
        });
      });
    });
  };

  const getTest = makeGetTest(describe);
  getTest.only = makeGetTest(describe.only);

  const createExpectLegacyForbidden = username => resp => {
    expect(resp.body).to.eql({
      statusCode: 403,
      error: 'Forbidden',
      // eslint-disable-next-line max-len
      message: `action [indices:data/read/get] is unauthorized for user [${username}]: [security_exception] action [indices:data/read/get] is unauthorized for user [${username}]`
    });
  };

  const createExpectNotFound = (id, spaceId = DEFAULT_SPACE_ID) => (resp) => {
    expect(resp.body).to.eql({
      error: 'Not Found',
      message: `Saved object [visualization/${getIdPrefix(spaceId)}${id}] not found`,
      statusCode: 404,
    });
  };

  const createExpectDoesntExistNotFound = (spaceId = DEFAULT_SPACE_ID) => {
    return createExpectNotFound(doesntExistId, spaceId);
  };

  const createExpectExistsNotFound = (spaceId = DEFAULT_SPACE_ID) => {
    return createExpectNotFound(existsId, spaceId);
  };

  const createExpectRbacForbidden = () => (resp) => {
    expect(resp.body).to.eql({
      error: 'Forbidden',
      message: `Unable to get visualization, missing action:saved_objects/visualization/get`,
      statusCode: 403,
    });
  };

  const createExpectResults = (spaceId = DEFAULT_SPACE_ID) => (resp) => {
    expect(resp.body).to.eql({
      id: `${getIdPrefix(spaceId)}dd7caf20-9efd-11e7-acb3-3dab96693fab`,
      type: 'visualization',
      updated_at: '2017-09-21T18:51:23.794Z',
      version: resp.body.version,
      attributes: {
        title: 'Count of requests',
        description: '',
        version: 1,
        // cheat for some of the more complex attributes
        visState: resp.body.attributes.visState,
        uiStateJSON: resp.body.attributes.uiStateJSON,
        kibanaSavedObjectMeta: resp.body.attributes.kibanaSavedObjectMeta
      }
    });
  };

  return {
    createExpectDoesntExistNotFound,
    createExpectExistsNotFound,
    createExpectLegacyForbidden,
    createExpectRbacForbidden,
    createExpectResults,
    getTest
  };
}
