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

describe(`#bulkCreate`, () => {
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

    const objects = [
      { type: 'foo' },
      { type: 'foo' },
      { type: 'bar' },
    ];

    await expect(client.bulkCreate(objects)).rejects.toThrowError('mock ForbiddenError');
    expect(mockHasPrivileges).toHaveBeenCalledWith(['action:saved-objects/foo/create', 'action:saved-objects/bar/create']);
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

    await expect(client.bulkCreate([{ type: 'foo' }])).rejects.toThrowError('mock GeneralError');
    expect(mockHasPrivileges).toHaveBeenCalledWith(['action:saved-objects/foo/create']);
    expect(mockErrors.decorateGeneralError).toHaveBeenCalledTimes(1);
  });

  test(`calls and returns result of repository.bulkCreate`, async () => {
    const returnValue = Symbol();
    const mockRepository = {
      bulkCreate: jest.fn().mockReturnValue(returnValue)
    };
    const mockHasPrivileges = jest.fn().mockImplementation(async () => ({
      success: true
    }));
    const client = new SecureSavedObjectsClient({
      repository: mockRepository,
      hasPrivileges: mockHasPrivileges
    });


    const objects = [
      { type: 'foo', otherThing: 'sup' },
      { type: 'bar', otherThing: 'everyone' },
    ];

    const options = Symbol();
    const result = await client.bulkCreate(objects, options);

    expect(result).toBe(returnValue);
    expect(mockRepository.bulkCreate).toHaveBeenCalledWith(objects, options);
  });
});

describe('#delete', () => {
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

    await expect(client.delete(type, 'foo-id')).rejects.toThrowError('mock ForbiddenError');
    expect(mockHasPrivileges).toHaveBeenCalledWith(['action:saved-objects/foo/delete']);
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

    await expect(client.delete(type)).rejects.toThrowError('mock GeneralError');
    expect(mockHasPrivileges).toHaveBeenCalledWith(['action:saved-objects/foo/delete']);
    expect(mockErrors.decorateGeneralError).toHaveBeenCalledTimes(1);
  });

  test(`calls and returns result of repository.delete`, async () => {
    const returnValue = Symbol();
    const mockRepository = {
      delete: jest.fn().mockReturnValue(returnValue)
    };
    const mockHasPrivileges = jest.fn().mockImplementation(async () => ({
      success: true
    }));
    const client = new SecureSavedObjectsClient({
      repository: mockRepository,
      hasPrivileges: mockHasPrivileges
    });


    const type = 'foo';
    const id = Symbol();
    const result = await client.delete(type, id);

    expect(result).toBe(returnValue);
    expect(mockRepository.delete).toHaveBeenCalledWith(type, id);
  });
});
