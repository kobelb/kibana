/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * and the Server Side Public License, v 1; you may not use this file except in
 * compliance with, at your election, the Elastic License or the Server Side
 * Public License, v 1.
 */

import { ColorSchemas } from '../color_maps';
import { Rotates } from './collections';

export interface ColorSchemaParams {
  colorSchema: ColorSchemas;
  invertColors: boolean;
}

export interface Labels {
  color?: string;
  filter?: boolean;
  overwriteColor?: boolean;
  rotate?: Rotates;
  show: boolean;
  truncate?: number | null;
}

export interface Style {
  bgFill: string;
  bgColor: boolean;
  labelColor: boolean;
  subText: string;
  fontSize: number;
}
