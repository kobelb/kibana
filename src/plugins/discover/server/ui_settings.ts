/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * and the Server Side Public License, v 1; you may not use this file except in
 * compliance with, at your election, the Elastic License or the Server Side
 * Public License, v 1.
 */

import { i18n } from '@kbn/i18n';
import { schema } from '@kbn/config-schema';

import { UiSettingsParams } from 'kibana/server';
import { METRIC_TYPE } from '@kbn/analytics';
import {
  DEFAULT_COLUMNS_SETTING,
  SAMPLE_SIZE_SETTING,
  AGGS_TERMS_SIZE_SETTING,
  SORT_DEFAULT_ORDER_SETTING,
  SEARCH_ON_PAGE_LOAD_SETTING,
  DOC_HIDE_TIME_COLUMN_SETTING,
  FIELDS_LIMIT_SETTING,
  CONTEXT_DEFAULT_SIZE_SETTING,
  CONTEXT_STEP_SETTING,
  CONTEXT_TIE_BREAKER_FIELDS_SETTING,
  DOC_TABLE_LEGACY,
  MODIFY_COLUMNS_ON_SWITCH,
  SEARCH_FIELDS_FROM_SOURCE,
} from '../common';

export const uiSettings: Record<string, UiSettingsParams> = {
  [DEFAULT_COLUMNS_SETTING]: {
    name: i18n.translate('discover.advancedSettings.defaultColumnsTitle', {
      defaultMessage: 'Default columns',
    }),
    value: ['_source'],
    description: i18n.translate('discover.advancedSettings.defaultColumnsText', {
      defaultMessage: 'Columns displayed by default in the Discovery tab',
    }),
    category: ['discover'],
    schema: schema.arrayOf(schema.string()),
  },
  [SAMPLE_SIZE_SETTING]: {
    name: i18n.translate('discover.advancedSettings.sampleSizeTitle', {
      defaultMessage: 'Number of rows',
    }),
    value: 500,
    description: i18n.translate('discover.advancedSettings.sampleSizeText', {
      defaultMessage: 'The number of rows to show in the table',
    }),
    category: ['discover'],
    schema: schema.number(),
  },
  [AGGS_TERMS_SIZE_SETTING]: {
    name: i18n.translate('discover.advancedSettings.aggsTermsSizeTitle', {
      defaultMessage: 'Number of terms',
    }),
    value: 20,
    type: 'number',
    description: i18n.translate('discover.advancedSettings.aggsTermsSizeText', {
      defaultMessage:
        'Determines how many terms will be visualized when clicking the "visualize" ' +
        'button, in the field drop downs, in the discover sidebar.',
    }),
    category: ['discover'],
    schema: schema.number(),
  },
  [SORT_DEFAULT_ORDER_SETTING]: {
    name: i18n.translate('discover.advancedSettings.sortDefaultOrderTitle', {
      defaultMessage: 'Default sort direction',
    }),
    value: 'desc',
    options: ['desc', 'asc'],
    optionLabels: {
      desc: i18n.translate('discover.advancedSettings.sortOrderDesc', {
        defaultMessage: 'Descending',
      }),
      asc: i18n.translate('discover.advancedSettings.sortOrderAsc', {
        defaultMessage: 'Ascending',
      }),
    },
    type: 'select',
    description: i18n.translate('discover.advancedSettings.sortDefaultOrderText', {
      defaultMessage:
        'Controls the default sort direction for time based index patterns in the Discover app.',
    }),
    category: ['discover'],
    schema: schema.oneOf([schema.literal('desc'), schema.literal('asc')]),
  },
  [SEARCH_ON_PAGE_LOAD_SETTING]: {
    name: i18n.translate('discover.advancedSettings.searchOnPageLoadTitle', {
      defaultMessage: 'Search on page load',
    }),
    value: true,
    type: 'boolean',
    description: i18n.translate('discover.advancedSettings.searchOnPageLoadText', {
      defaultMessage:
        'Controls whether a search is executed when Discover first loads. This setting does not ' +
        'have an effect when loading a saved search.',
    }),
    category: ['discover'],
    schema: schema.boolean(),
  },
  [DOC_HIDE_TIME_COLUMN_SETTING]: {
    name: i18n.translate('discover.advancedSettings.docTableHideTimeColumnTitle', {
      defaultMessage: "Hide 'Time' column",
    }),
    value: false,
    description: i18n.translate('discover.advancedSettings.docTableHideTimeColumnText', {
      defaultMessage: "Hide the 'Time' column in Discover and in all Saved Searches on Dashboards.",
    }),
    category: ['discover'],
    schema: schema.boolean(),
  },
  [FIELDS_LIMIT_SETTING]: {
    name: i18n.translate('discover.advancedSettings.fieldsPopularLimitTitle', {
      defaultMessage: 'Popular fields limit',
    }),
    value: 10,
    description: i18n.translate('discover.advancedSettings.fieldsPopularLimitText', {
      defaultMessage: 'The top N most popular fields to show',
    }),
    schema: schema.number(),
  },
  [CONTEXT_DEFAULT_SIZE_SETTING]: {
    name: i18n.translate('discover.advancedSettings.context.defaultSizeTitle', {
      defaultMessage: 'Context size',
    }),
    value: 5,
    description: i18n.translate('discover.advancedSettings.context.defaultSizeText', {
      defaultMessage: 'The number of surrounding entries to show in the context view',
    }),
    category: ['discover'],
    schema: schema.number(),
  },
  [CONTEXT_STEP_SETTING]: {
    name: i18n.translate('discover.advancedSettings.context.sizeStepTitle', {
      defaultMessage: 'Context size step',
    }),
    value: 5,
    description: i18n.translate('discover.advancedSettings.context.sizeStepText', {
      defaultMessage: 'The step size to increment or decrement the context size by',
    }),
    category: ['discover'],
    schema: schema.number(),
  },
  [CONTEXT_TIE_BREAKER_FIELDS_SETTING]: {
    name: i18n.translate('discover.advancedSettings.context.tieBreakerFieldsTitle', {
      defaultMessage: 'Tie breaker fields',
    }),
    value: ['_doc'],
    description: i18n.translate('discover.advancedSettings.context.tieBreakerFieldsText', {
      defaultMessage:
        'A comma-separated list of fields to use for tie-breaking between documents that have the same timestamp value. ' +
        'From this list the first field that is present and sortable in the current index pattern is used.',
    }),
    category: ['discover'],
    schema: schema.arrayOf(schema.string()),
  },
  [DOC_TABLE_LEGACY]: {
    name: i18n.translate('discover.advancedSettings.docTableVersionName', {
      defaultMessage: 'Use legacy table',
    }),
    value: true,
    description: i18n.translate('discover.advancedSettings.docTableVersionDescription', {
      defaultMessage:
        'Discover uses a new table layout that includes better data sorting, drag-and-drop columns, and a full screen ' +
        'view. Enable this option if you prefer to fall back to the legacy table.',
    }),
    category: ['discover'],
    schema: schema.boolean(),
    metric: {
      type: METRIC_TYPE.CLICK,
      name: 'discover:useLegacyDataGrid',
    },
  },
  [MODIFY_COLUMNS_ON_SWITCH]: {
    name: i18n.translate('discover.advancedSettings.discover.modifyColumnsOnSwitchTitle', {
      defaultMessage: 'Modify columns when changing index patterns',
    }),
    value: true,
    description: i18n.translate('discover.advancedSettings.discover.modifyColumnsOnSwitchText', {
      defaultMessage: 'Remove columns that are not available in the new index pattern.',
    }),
    category: ['discover'],
    schema: schema.boolean(),
    metric: {
      type: METRIC_TYPE.CLICK,
      name: 'discover:modifyColumnsOnSwitchTitle',
    },
  },
  [SEARCH_FIELDS_FROM_SOURCE]: {
    name: 'Read fields from _source',
    description: `When enabled will load documents directly from \`_source\`. This is soon going to be deprecated. When disabled, will retrieve fields via the new Fields API in the high-level search service.`,
    value: true,
    category: ['discover'],
    schema: schema.boolean(),
  },
};
