/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { SecureSavedObjectsClient } from './secure_saved_objects_client';

describe('#errors', () => {
  test(`assigns errors from constructor to .errors`, () => {
    const errors = Symbol();

    const client = new SecureSavedObjectsClient({ errors });

    expect(client.errors).toBe(errors);
  });
});

describe(`#create`, () => {
  test(`throws decorated ForbiddenError when user doesn't have privileges`, async () => {
    const mockRepository = {};
    const mockErrors = {
      decorateForbiddenError: jest.fn().mockReturnValue(new Error('mock ForbiddenError'))
    };
    const mockHasPrivileges = jest.fn().mockImplementation(async () => ({
      success: false,
      missing: [
        'action:saved-objects/foo/create'
      ]
    }));

    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      repository: mockRepository,
      hasPrivileges: mockHasPrivileges
    });

    const type = 'foo';

    await expect(client.create(type)).rejects.toThrowError('mock ForbiddenError');
    expect(mockHasPrivileges).toHaveBeenCalledWith(['action:saved-objects/foo/create']);
    expect(mockErrors.decorateForbiddenError).toHaveBeenCalledTimes(1);
  });

  test(`throws decorated GeneralError when hasPrivileges rejects promise`, async () => {
    const mockRepository = {};
    const mockErrors = {
      decorateGeneralError: jest.fn().mockReturnValue(new Error('mock GeneralError'))
    };
    const mockHasPrivileges = jest.fn().mockImplementation(async () => {
      throw new Error();
    });

    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      repository: mockRepository,
      hasPrivileges: mockHasPrivileges
    });

    const type = 'foo';

    await expect(client.create(type)).rejects.toThrowError('mock GeneralError');
    expect(mockHasPrivileges).toHaveBeenCalledWith(['action:saved-objects/foo/create']);
    expect(mockErrors.decorateGeneralError).toHaveBeenCalledTimes(1);
  });

  test(`calls and returns result of repository.create`, async () => {
    const returnValue = Symbol();
    const mockRepository = {
      create: jest.fn().mockReturnValue(returnValue)
    };
    const mockHasPrivileges = jest.fn().mockImplementation(async () => ({
      success: true
    }));
    const client = new SecureSavedObjectsClient({
      repository: mockRepository,
      hasPrivileges: mockHasPrivileges
    });


    const type = 'foo';
    const attributes = Symbol();
    const options = Symbol();
    const result = await client.create(type, attributes, options);

    expect(result).toBe(returnValue);
    expect(mockRepository.create).toHaveBeenCalledWith(type, attributes, options);
  });
});

