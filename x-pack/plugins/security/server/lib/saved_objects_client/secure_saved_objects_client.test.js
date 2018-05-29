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
    const type = 'foo';
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => ({
      success: false,
      missing: [
        `action:saved-objects/${type}/create`
      ]
    }));
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      hasPrivileges: mockHasPrivileges
    });

    await expect(client.create(type)).rejects.toThrowError(mockErrors.forbiddenError);

    expect(mockHasPrivileges).toHaveBeenCalledWith([`action:saved-objects/${type}/create`]);
    expect(mockErrors.decorateForbiddenError).toHaveBeenCalledTimes(1);
  });

  test(`throws decorated GeneralError when hasPrivileges rejects promise`, async () => {
    const type = 'foo';
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => {
      throw new Error();
    });
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      hasPrivileges: mockHasPrivileges
    });

    await expect(client.create(type)).rejects.toThrowError(mockErrors.generalError);

    expect(mockHasPrivileges).toHaveBeenCalledWith([`action:saved-objects/${type}/create`]);
    expect(mockErrors.decorateGeneralError).toHaveBeenCalledTimes(1);
  });

  test(`calls and returns result of repository.create`, async () => {
    const type = 'foo';
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
    const attributes = Symbol();
    const options = Symbol();

    const result = await client.create(type, attributes, options);

    expect(result).toBe(returnValue);
    expect(mockRepository.create).toHaveBeenCalledWith(type, attributes, options);
  });
});

describe('#bulkCreate', () => {
  test(`throws decorated ForbiddenError when user doesn't have privileges`, async () => {
    const type1 = 'foo';
    const type2 = 'bar';
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => ({
      success: false,
      missing: [
        `action:saved-objects/${type1}/create`
      ]
    }));
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      hasPrivileges: mockHasPrivileges
    });
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
    const type = 'foo';
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => {
      throw new Error();
    });
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      hasPrivileges: mockHasPrivileges
    });

    await expect(client.bulkCreate([{ type }])).rejects.toThrowError(mockErrors.generalError);

    expect(mockHasPrivileges).toHaveBeenCalledWith([`action:saved-objects/${type}/create`]);
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
    const type = 'foo';
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => ({
      success: false,
      missing: [
        `action:saved-objects/${type}/delete`
      ]
    }));
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      hasPrivileges: mockHasPrivileges
    });

    await expect(client.delete(type, 'foo-id')).rejects.toThrowError(mockErrors.forbiddenError);

    expect(mockHasPrivileges).toHaveBeenCalledWith([`action:saved-objects/${type}/delete`]);
    expect(mockErrors.decorateForbiddenError).toHaveBeenCalledTimes(1);
  });

  test(`throws decorated GeneralError when hasPrivileges rejects promise`, async () => {
    const type = 'foo';
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => {
      throw new Error();
    });
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      hasPrivileges: mockHasPrivileges
    });

    await expect(client.delete(type)).rejects.toThrowError(mockErrors.generalError);

    expect(mockHasPrivileges).toHaveBeenCalledWith([`action:saved-objects/${type}/delete`]);
    expect(mockErrors.decorateGeneralError).toHaveBeenCalledTimes(1);
  });

  test(`calls and returns result of repository.delete`, async () => {
    const type = 'foo';
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
    const id = Symbol();

    const result = await client.delete(type, id);

    expect(result).toBe(returnValue);
    expect(mockRepository.delete).toHaveBeenCalledWith(type, id);
  });
});

describe('#find', () => {
  test(`throws decorated ForbiddenError when user has no authorized types`, async () => {
    const type = 'foo';
    const mockRepository = {
      getTypes: jest.fn().mockReturnValue([type])
    };
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => ({
      success: false,
      missing: [
        `action:saved-objects/${type}/search`
      ]
    }));
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      repository: mockRepository,
      hasPrivileges: mockHasPrivileges
    });

    await expect(client.find()).rejects.toThrowError(mockErrors.forbiddenError);

    expect(mockHasPrivileges).toHaveBeenCalledWith([`action:saved-objects/${type}/search`]);
    expect(mockErrors.decorateForbiddenError).toHaveBeenCalledTimes(1);
  });

  test(`throws decorated GeneralError when hasPrivileges rejects promise`, async () => {
    const type1 = 'foo';
    const type2 = 'bar';
    const mockRepository = {
      getTypes: jest.fn().mockReturnValue([type1, type2])
    };
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => {
      throw new Error();
    });
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      repository: mockRepository,
      hasPrivileges: mockHasPrivileges
    });

    await expect(client.find()).rejects.toThrowError(mockErrors.generalError);

    expect(mockHasPrivileges).toHaveBeenCalledWith([`action:saved-objects/${type1}/search`, `action:saved-objects/${type2}/search`]);
    expect(mockErrors.decorateGeneralError).toHaveBeenCalledTimes(1);
  });

  test(`specifies terms filter for authorized types when there are no other filters`, async () => {
    const type1 = 'foo';
    const type2 = 'bar';
    const mockRepository = {
      getTypes: jest.fn().mockReturnValue([type1, type2]),
      find: jest.fn(),
    };
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => ({
      success: false,
      missing: [
        `action:saved-objects/${type1}/search`
      ]
    }));
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      repository: mockRepository,
      hasPrivileges: mockHasPrivileges
    });

    await client.find();

    expect(mockHasPrivileges).toHaveBeenCalledWith([`action:saved-objects/${type1}/search`, `action:saved-objects/${type2}/search`]);
    expect(mockRepository.find).toHaveBeenCalledWith(expect.objectContaining({
      filters: [{
        terms: {
          type: [type2]
        }
      }]
    }));
  });

  test(`appends terms filter for authorized types when there are other filters`, async () => {
    const type1 = 'foo';
    const type2 = 'bar';
    const mockRepository = {
      getTypes: jest.fn().mockReturnValue([type1, type2]),
      find: jest.fn(),
    };
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => ({
      success: false,
      missing: [
        `action:saved-objects/${type1}/search`
      ]
    }));
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      repository: mockRepository,
      hasPrivileges: mockHasPrivileges
    });

    await client.find({
      filters: [{
        term: {
          'quz': 'baz'
        }
      }]
    });

    expect(mockHasPrivileges).toHaveBeenCalledWith([`action:saved-objects/${type1}/search`, `action:saved-objects/${type2}/search`]);
    expect(mockRepository.find).toHaveBeenCalledWith(expect.objectContaining({
      filters: [{
        term: {
          'quz': 'baz'
        }
      }, {
        terms: {
          type: [type2]
        }
      }]
    }));
  });

});

describe('#bulkGet', () => {
  test(`throws decorated ForbiddenError when user doesn't have privileges`, async () => {
    const type1 = 'foo';
    const type2 = 'bar';
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => ({
      success: false,
      missing: [
        `action:saved-objects/${type1}/mget`
      ]
    }));
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      hasPrivileges: mockHasPrivileges
    });
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
    const type = 'foo';
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => {
      throw new Error();
    });
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      hasPrivileges: mockHasPrivileges
    });

    await expect(client.bulkGet([{ type }])).rejects.toThrowError(mockErrors.generalError);

    expect(mockHasPrivileges).toHaveBeenCalledWith(['action:saved-objects/foo/mget']);
    expect(mockErrors.decorateGeneralError).toHaveBeenCalledTimes(1);
  });

  test(`calls and returns result of repository.bulkGet`, async () => {
    const type1 = 'foo';
    const type2 = 'bar';
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
      { type: type1, id: 'foo-id' },
      { type: type2, id: 'bar-id' },
    ];

    const result = await client.bulkGet(objects);

    expect(result).toBe(returnValue);
    expect(mockRepository.bulkGet).toHaveBeenCalledWith(objects);
  });
});

describe('#get', () => {
  test(`throws decorated ForbiddenError when user doesn't have privileges`, async () => {
    const type = 'foo';
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => ({
      success: false,
      missing: [
        `action:saved-objects/${type}/get`
      ]
    }));
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      hasPrivileges: mockHasPrivileges
    });

    await expect(client.get(type, 'foo-id')).rejects.toThrowError(mockErrors.forbiddenError);

    expect(mockHasPrivileges).toHaveBeenCalledWith([`action:saved-objects/${type}/get`]);
    expect(mockErrors.decorateForbiddenError).toHaveBeenCalledTimes(1);
  });

  test(`throws decorated GeneralError when hasPrivileges rejects promise`, async () => {
    const type = 'foo';
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => {
      throw new Error();
    });
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      hasPrivileges: mockHasPrivileges
    });

    await expect(client.get(type)).rejects.toThrowError(mockErrors.generalError);

    expect(mockHasPrivileges).toHaveBeenCalledWith([`action:saved-objects/${type}/get`]);
    expect(mockErrors.decorateGeneralError).toHaveBeenCalledTimes(1);
  });

  test(`calls and returns result of repository.get`, async () => {
    const type = 'foo';
    const returnValue = Symbol();
    const mockRepository = {
      get: jest.fn().mockReturnValue(returnValue)
    };
    const mockHasPrivileges = jest.fn().mockImplementation(async () => ({
      success: true
    }));
    const client = new SecureSavedObjectsClient({
      repository: mockRepository,
      hasPrivileges: mockHasPrivileges
    });
    const id = Symbol();

    const result = await client.get(type, id);

    expect(result).toBe(returnValue);
    expect(mockRepository.get).toHaveBeenCalledWith(type, id);
  });
});

describe('#update', () => {
  test(`throws decorated ForbiddenError when user doesn't have privileges`, async () => {
    const type = 'foo';
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => ({
      success: false,
      missing: [
        'action:saved-objects/foo/update'
      ]
    }));
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      hasPrivileges: mockHasPrivileges
    });

    await expect(client.update(type)).rejects.toThrowError(mockErrors.forbiddenError);

    expect(mockHasPrivileges).toHaveBeenCalledWith([`action:saved-objects/${type}/update`]);
    expect(mockErrors.decorateForbiddenError).toHaveBeenCalledTimes(1);
  });

  test(`throws decorated GeneralError when hasPrivileges rejects promise`, async () => {
    const type = 'foo';
    const mockErrors = createMockErrors();
    const mockHasPrivileges = jest.fn().mockImplementation(async () => {
      throw new Error();
    });
    const client = new SecureSavedObjectsClient({
      errors: mockErrors,
      hasPrivileges: mockHasPrivileges
    });

    await expect(client.update(type)).rejects.toThrowError(mockErrors.generalError);

    expect(mockHasPrivileges).toHaveBeenCalledWith([`action:saved-objects/${type}/update`]);
    expect(mockErrors.decorateGeneralError).toHaveBeenCalledTimes(1);
  });

  test(`calls and returns result of repository.update`, async () => {
    const type = 'foo';
    const returnValue = Symbol();
    const mockRepository = {
      update: jest.fn().mockReturnValue(returnValue)
    };
    const mockHasPrivileges = jest.fn().mockImplementation(async () => ({
      success: true
    }));
    const client = new SecureSavedObjectsClient({
      repository: mockRepository,
      hasPrivileges: mockHasPrivileges
    });
    const id = Symbol();
    const attributes = Symbol();
    const options = Symbol();

    const result = await client.update(type, id, attributes, options);

    expect(result).toBe(returnValue);
    expect(mockRepository.update).toHaveBeenCalledWith(type, id, attributes, options);
  });
});
