/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * and the Server Side Public License, v 1; you may not use this file except in
 * compliance with, at your election, the Elastic License or the Server Side
 * Public License, v 1.
 */

import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { AppMountContext, AppMountParameters } from 'kibana/public';
import { Main } from './components/main';

export const renderApp = (context: AppMountContext, { element }: AppMountParameters) => {
  render(<Main />, element);
  return () => unmountComponentAtNode(element);
};
