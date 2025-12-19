/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

// Re-export Condition types and schemas from @kbn/streams-schema
// This maintains backward compatibility while breaking the circular dependency
export type {
  Condition,
  FilterCondition,
  AndCondition,
  OrCondition,
  NotCondition,
  NeverCondition,
  AlwaysCondition,
  ShorthandBinaryFilterCondition,
  ShorthandUnaryFilterCondition,
  RangeCondition,
  BinaryOperatorKeys,
  UnaryOperatorKeys,
  OperatorKeys,
  StringOrNumberOrBoolean,
} from '@kbn/streams-schema';

export {
  conditionSchema,
  filterConditionSchema,
  shorthandBinaryFilterConditionSchema,
  shorthandUnaryFilterConditionSchema,
  rangeConditionSchema,
  andConditionSchema,
  orConditionSchema,
  notConditionSchema,
  neverConditionSchema,
  alwaysConditionSchema,
  isCondition,
  isFilterCondition,
  isBinaryFilterCondition,
  isUnaryFilterCondition,
  isAndCondition,
  isOrCondition,
  isNotCondition,
  isNeverCondition,
  isAlwaysCondition,
  ALWAYS_CONDITION,
  NEVER_CONDITION,
  BINARY_OPERATORS,
  UNARY_OPERATORS,
} from '@kbn/streams-schema';

// Keep i18n-specific exports local since @kbn/streams-schema doesn't depend on @kbn/i18n
import { i18n } from '@kbn/i18n';
import type { BinaryOperatorKeys, UnaryOperatorKeys } from '@kbn/streams-schema';

export const operatorToHumanReadableNameMap = {
  eq: i18n.translate('xpack.streams.filter.equals', { defaultMessage: 'equals' }),
  neq: i18n.translate('xpack.streams.filter.notEquals', { defaultMessage: 'not equals' }),
  lt: i18n.translate('xpack.streams.filter.lessThan', { defaultMessage: 'less than' }),
  lte: i18n.translate('xpack.streams.filter.lessThanOrEquals', {
    defaultMessage: 'less than or equals',
  }),
  gt: i18n.translate('xpack.streams.filter.greaterThan', { defaultMessage: 'greater than' }),
  gte: i18n.translate('xpack.streams.filter.greaterThanOrEquals', {
    defaultMessage: 'greater than or equals',
  }),
  contains: i18n.translate('xpack.streams.filter.contains', { defaultMessage: 'contains' }),
  startsWith: i18n.translate('xpack.streams.filter.startsWith', { defaultMessage: 'starts with' }),
  endsWith: i18n.translate('xpack.streams.filter.endsWith', { defaultMessage: 'ends with' }),
  exists: i18n.translate('xpack.streams.filter.exists', { defaultMessage: 'exists' }),
};
