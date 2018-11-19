/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

export interface HasPrivilegesResponseApplication {
  [resource: string]: {
    [privilege: string]: boolean;
  };
}

export interface HasPrivilegesResponse {
  has_all_requested: boolean;
  username: string;
  cluster: {
    [privilege: string]: boolean;
  };
  application: {
    [applicationName: string]: HasPrivilegesResponseApplication;
  };
}
