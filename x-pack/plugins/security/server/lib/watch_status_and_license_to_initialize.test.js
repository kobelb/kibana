/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements.
 * Licensed under the Elastic License; you may not use this file except in compliance with the Elastic License. */
import { EventEmitter } from 'events';
import { watchStatusAndLicenseToInitialize } from './watch_status_and_license_to_initialize';

const createMockXpackMainPluginAndFeature = (featureId) => {
  const licenseChangeCallbacks = [];

  const mockFeature = {
    getLicenseCheckResults: jest.fn(),
    registerLicenseChangeCallback: (callback) => {
      licenseChangeCallbacks.push(callback);
    },
    mock: {
      triggerLicenseChange: () => {
        for (const callback of licenseChangeCallbacks) {
          callback();
        }
      },
      setLicenseCheckResults: (value) => {
        mockFeature.getLicenseCheckResults.mockReturnValue(value);
      }
    }
  };

  const mockXpackMainPlugin =  {
    info: {
      feature: (id) => {
        if (id === featureId) {
          return mockFeature;
        }
        throw new Error('Unexpected feature');
      }
    },
    status: new EventEmitter(),
    mock: {
      setStatus: (state) => {
        mockXpackMainPlugin.status.state = state;
        mockXpackMainPlugin.status.message = `${state} is the state`;
        mockXpackMainPlugin.status.emit('change', null, null, mockXpackMainPlugin.status.state, mockXpackMainPlugin.status.message);
      }
    }
  };

  return { mockXpackMainPlugin, mockFeature };
};

const createMockDownstreamPlugin = (id) => {
  return {
    id,
    status: {
      disabled: jest.fn(),
      yellow: jest.fn(),
      green: jest.fn(),
      red: jest.fn(),
    },
  };
};

['red', 'yellow', 'disabled' ].forEach(state => {
  test(`mirrors ${state} immediately`, () => {
    const pluginId = 'foo-plugin';
    const { mockXpackMainPlugin } = createMockXpackMainPluginAndFeature(pluginId);
    mockXpackMainPlugin.mock.setStatus(state);
    const downstreamPlugin = createMockDownstreamPlugin(pluginId);
    const initializeMock = jest.fn();

    watchStatusAndLicenseToInitialize(mockXpackMainPlugin, downstreamPlugin, initializeMock);

    expect(initializeMock).not.toHaveBeenCalled();
    expect(downstreamPlugin.status[state]).toHaveBeenCalledTimes(1);
  });
});

test(`calls initialize and doesn't immediately set downstream status when the initial status is green`, () => {
  const pluginId = 'foo-plugin';
  const { mockXpackMainPlugin, mockFeature } = createMockXpackMainPluginAndFeature(pluginId);
  mockXpackMainPlugin.mock.setStatus('green');
  const licenseCheckResults = Symbol();
  mockFeature.mock.setLicenseCheckResults(licenseCheckResults);
  const downstreamPlugin = createMockDownstreamPlugin(pluginId);
  const initializeMock = jest.fn().mockImplementation(() => new Promise(() => {}));

  watchStatusAndLicenseToInitialize(mockXpackMainPlugin, downstreamPlugin, initializeMock);

  expect(initializeMock).toHaveBeenCalledTimes(1);
  expect(initializeMock).toHaveBeenCalledWith(licenseCheckResults);
  expect(downstreamPlugin.status.green).toHaveBeenCalledTimes(0);
});

test(`sets downstream plugin's status to green when initialize resolves`, (done) => {
  const pluginId = 'foo-plugin';
  const { mockXpackMainPlugin, mockFeature } = createMockXpackMainPluginAndFeature(pluginId);
  mockXpackMainPlugin.mock.setStatus('green');
  const licenseCheckResults = Symbol();
  mockFeature.mock.setLicenseCheckResults(licenseCheckResults);
  const downstreamPlugin = createMockDownstreamPlugin(pluginId);
  const initializeMock = jest.fn().mockImplementation(() => Promise.resolve());

  watchStatusAndLicenseToInitialize(mockXpackMainPlugin, downstreamPlugin, initializeMock);

  expect(initializeMock).toHaveBeenCalledTimes(1);
  expect(initializeMock).toHaveBeenCalledWith(licenseCheckResults);
  downstreamPlugin.status.green.mockImplementation(() => done());
});

test(`sets downstream plugin's status to red when initialize rejects`, (done) => {
  const pluginId = 'foo-plugin';
  const { mockXpackMainPlugin, mockFeature } = createMockXpackMainPluginAndFeature(pluginId);
  mockXpackMainPlugin.mock.setStatus('green');
  const licenseCheckResults = Symbol();
  mockFeature.mock.setLicenseCheckResults(licenseCheckResults);
  const downstreamPlugin = createMockDownstreamPlugin(pluginId);
  const initializeMock = jest.fn().mockImplementation(() => Promise.reject(new Error()));

  watchStatusAndLicenseToInitialize(mockXpackMainPlugin, downstreamPlugin, initializeMock);

  expect(initializeMock).toHaveBeenCalledTimes(1);
  expect(initializeMock).toHaveBeenCalledWith(licenseCheckResults);
  downstreamPlugin.status.red.mockImplementation(() => done());
});

test(`calls initialize twice when it gets a new license`, (done) => {
  const pluginId = 'foo-plugin';
  const { mockXpackMainPlugin, mockFeature } = createMockXpackMainPluginAndFeature(pluginId);
  mockXpackMainPlugin.mock.setStatus('green');
  const firstLicenseCheckResults = Symbol();
  const secondLicenseCheckResults = Symbol();
  mockFeature.mock.setLicenseCheckResults(firstLicenseCheckResults);
  const downstreamPlugin = createMockDownstreamPlugin(pluginId);
  const initializeMock = jest.fn().mockImplementation(() => Promise.resolve());

  let count = 0;
  downstreamPlugin.status.green.mockImplementation(() => {
    ++count;
    if (count === 1) {
      mockFeature.mock.setLicenseCheckResults(secondLicenseCheckResults);
      mockFeature.mock.triggerLicenseChange();
    }
    if (count === 2) {
      expect(initializeMock).toHaveBeenCalledWith(firstLicenseCheckResults);
      expect(initializeMock).toHaveBeenCalledWith(secondLicenseCheckResults);
      expect(initializeMock).toHaveBeenCalledTimes(2);
      done();
    }
  });

  watchStatusAndLicenseToInitialize(mockXpackMainPlugin, downstreamPlugin, initializeMock);
});

test(`calls initialize twice when the status changes to green twice`, (done) => {
  const pluginId = 'foo-plugin';
  const { mockXpackMainPlugin, mockFeature } = createMockXpackMainPluginAndFeature(pluginId);
  mockXpackMainPlugin.mock.setStatus('green');
  const licenseCheckResults = Symbol();
  mockFeature.mock.setLicenseCheckResults(licenseCheckResults);
  const downstreamPlugin = createMockDownstreamPlugin(pluginId);
  const initializeMock = jest.fn().mockImplementation(() => Promise.resolve());

  let count = 0;
  downstreamPlugin.status.green.mockImplementation(() => {
    ++count;
    if (count === 1) {
      mockXpackMainPlugin.mock.setStatus('green');
    }
    if (count === 2) {
      expect(initializeMock).toHaveBeenCalledWith(licenseCheckResults);
      expect(initializeMock).toHaveBeenCalledTimes(2);
      done();
    }
  });

  watchStatusAndLicenseToInitialize(mockXpackMainPlugin, downstreamPlugin, initializeMock);
});
