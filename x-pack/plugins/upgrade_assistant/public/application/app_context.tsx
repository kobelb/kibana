/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { DocLinksStart, HttpSetup } from 'src/core/public';
import React, { createContext, useContext } from 'react';

export interface KibanaVersionContext {
  currentMajor: number;
  prevMajor: number;
  nextMajor: number;
}

export interface ContextValue {
  http: HttpSetup;
  isCloudEnabled: boolean;
  docLinks: DocLinksStart;
  kibanaVersionInfo: KibanaVersionContext;
}

export const AppContext = createContext<ContextValue>({} as any);

export const AppContextProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ContextValue;
}) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be called from inside AppContext');
  }
  return ctx;
};
