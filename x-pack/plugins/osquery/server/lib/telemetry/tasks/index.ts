/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { OsqueryTelemetryTaskConfig } from '../task';
import { createTelemetryPacksTaskConfig } from './packs';
import { createTelemetrySavedQueriesTaskConfig } from './saved_queries';

export function createTelemetryTaskConfigs(): OsqueryTelemetryTaskConfig[] {
  return [createTelemetryPacksTaskConfig(), createTelemetrySavedQueriesTaskConfig()];
}
