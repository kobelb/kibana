/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

export type DescribeFn = (text: string, fn: () => void) => void;

export interface TestResultDescriptor {
  statusCode: number;
  response: (resp: any) => void;
  space?: any;
}

export interface TestsObject {
  [key: string]: TestResultDescriptor;
}

export interface TestDefinitionAuthentication {
  username?: string;
  password?: string;
}

export interface TestOptions {
  auth?: TestDefinitionAuthentication;
  currentSpaceId?: string;
  spaceId?: string;
  tests: TestsObject;
}

export type LoadTestFileFn = (path: string) => string;

export type GetServiceFn = (service: string) => any;

export interface TestInvoker {
  getService: GetServiceFn;
  loadTestFile: LoadTestFileFn;
}
