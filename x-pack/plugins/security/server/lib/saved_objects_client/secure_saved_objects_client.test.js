/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { SecureSavedObjectsClient } from './secure_saved_objects_client';

const createMockErrors = () => {
  const forbiddenError = new Error('Mock ForbiddenError');
  const generalError = new Error('Mock GeneralError');

  return {
    forbiddenError,
    decorateForbiddenError: jest.fn().mockReturnValue(forbiddenError),
    generalError,
    decorateGeneralError: jest.fn().mockReturnValue(generalError)
  };
};

describe('#errors', () => {
  test(`assigns errors from constructor to .errors`, () => {
    const errors = Symbol();

    const client = new SecureSavedObjectsClient({ errors });

    expect(client.errors).toBe(errors);
  });
});

describe('#create', () => {
  test(`throws decorated ForbiddenError when user doesn't have privileges`, async () => {
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => ({
      success: false,
      missing: [
        'action:saved-objects/foo/create'
      ]
    }));
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      hasPrivileges: mockHasPrivileges
    });
    const type = 'foo';

    await expect(client.create(type)).rejects.toThrowError(mockErrors.forbiddenError);

    expect(mockHasPrivileges).toHaveBeenCalledWith([`action:saved-objects/${type}/create`]);
    expect(mockErrors.decorateForbiddenError).toHaveBeenCalledTimes(1);
  });

  test(`throws decorated GeneralError when hasPrivileges rejects promise`, async () => {
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => {
      throw new Error();
    });
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      hasPrivileges: mockHasPrivileges
    });
    const type = 'foo';

    await expect(client.create(type)).rejects.toThrowError(mockErrors.generalError);

    expect(mockHasPrivileges).toHaveBeenCalledWith([`action:saved-objects/${type}/create`]);
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

describe('#bulkCreate', () => {
  test(`throws decorated ForbiddenError when user doesn't have privileges`, async () => {
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => ({
      success: false,
      missing: [
        'action:saved-objects/foo/create'
      ]
    }));
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      hasPrivileges: mockHasPrivileges
    });
    const type1 = 'foo';
    const type2 = 'bar';
    const objects = [
      { type: type1 },
      { type: type1 },
      { type: type2 },
    ];

    await expect(client.bulkCreate(objects)).rejects.toThrowError(mockErrors.forbiddenError);

    expect(mockHasPrivileges).toHaveBeenCalledWith([`action:saved-objects/${type1}/create`, `action:saved-objects/${type2}/create`]);
    expect(mockErrors.decorateForbiddenError).toHaveBeenCalledTimes(1);
  });

  test(`throws decorated GeneralError when hasPrivileges rejects promise`, async () => {
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => {
      throw new Error();
    });
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      hasPrivileges: mockHasPrivileges
    });

    await expect(client.bulkCreate([{ type: 'foo' }])).rejects.toThrowError(mockErrors.generalError);

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
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => ({
      success: false,
      missing: [
        'action:saved-objects/foo/create'
      ]
    }));
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      hasPrivileges: mockHasPrivileges
    });
    const type = 'foo';

    await expect(client.delete(type, 'foo-id')).rejects.toThrowError(mockErrors.forbiddenError);

    expect(mockHasPrivileges).toHaveBeenCalledWith([`action:saved-objects/${type}/delete`]);
    expect(mockErrors.decorateForbiddenError).toHaveBeenCalledTimes(1);
  });

  test(`throws decorated GeneralError when hasPrivileges rejects promise`, async () => {
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => {
      throw new Error();
    });
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      hasPrivileges: mockHasPrivileges
    });
    const type = 'foo';

    await expect(client.delete(type)).rejects.toThrowError(mockErrors.generalError);

    expect(mockHasPrivileges).toHaveBeenCalledWith([`action:saved-objects/${type}/delete`]);
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

describe('#bulkGet', () => {
  test(`throws decorated ForbiddenError when user doesn't have privileges`, async () => {
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => ({
      success: false,
      missing: [
        'action:saved-objects/foo/create'
      ]
    }));
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      hasPrivileges: mockHasPrivileges
    });
    const type1 = 'foo';
    const type2 = 'bar';
    const objects = [
      { type: type1 },
      { type: type1 },
      { type: type2 },
    ];

    await expect(client.bulkGet(objects)).rejects.toThrowError(mockErrors.forbiddenError);

    expect(mockHasPrivileges).toHaveBeenCalledWith([`action:saved-objects/${type1}/mget`, `action:saved-objects/${type2}/mget`]);
    expect(mockErrors.decorateForbiddenError).toHaveBeenCalledTimes(1);
  });

  test(`throws decorated GeneralError when hasPrivileges rejects promise`, async () => {
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => {
      throw new Error();
    });
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      hasPrivileges: mockHasPrivileges
    });

    await expect(client.bulkGet([{ type: 'foo' }])).rejects.toThrowError(mockErrors.generalError);

    expect(mockHasPrivileges).toHaveBeenCalledWith(['action:saved-objects/foo/mget']);
    expect(mockErrors.decorateGeneralError).toHaveBeenCalledTimes(1);
  });

  test(`calls and returns result of repository.bulkGet`, async () => {
    const returnValue = Symbol();
    const mockRepository = {
      bulkGet: jest.fn().mockReturnValue(returnValue)
    };
    const mockHasPrivileges = jest.fn().mockImplementation(async () => ({
      success: true
    }));
    const client = new SecureSavedObjectsClient({
      repository: mockRepository,
      hasPrivileges: mockHasPrivileges
    });
    const objects = [
      { type: 'foo', id: 'foo-id' },
      { type: 'bar', id: 'bar-id' },
    ];

    const result = await client.bulkGet(objects);

    expect(result).toBe(returnValue);
    expect(mockRepository.bulkGet).toHaveBeenCalledWith(objects);
  });
});
