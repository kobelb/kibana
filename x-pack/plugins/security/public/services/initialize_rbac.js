/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { uiModules } from 'ui/modules';
import chrome from 'ui/chrome';

const url = chrome.addBasePath(`/api/security/v1/initialize_rbac`);

const module = uiModules.get('security');
module.service('initializeRbac', ($http) => {
  return () => {
    return $http.post(url);
  };
});
