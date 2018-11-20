/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { Feature, registerFeature } from './feature_registry';

const kibanaFeatures: Feature[] = [
  {
    id: 'discover',
    name: 'Discover',
    icon: 'discoverApp',
    navLinkId: 'kibana:discover',
    privileges: {
      kibana: {
        all: {
          app: ['kibana'],
          savedObject: {
            all: ['search'],
            read: ['config', 'index-pattern'],
          },
          ui: {
            navLink: true,
          },
        },
        read: {
          app: ['kibana'],
          savedObject: {
            all: [],
            read: ['config', 'index-pattern', 'search'],
          },
          ui: {
            navLink: true,
          },
        },
      },
    },
  },
  {
    id: 'visualize',
    name: 'Visualize',
    icon: 'visualizeApp',
    navLinkId: 'kibana:visualize',
    privileges: {
      kibana: {
        all: {
          app: ['kibana'],
          savedObject: {
            all: ['visualization'],
            read: ['config', 'index-pattern', 'search'],
          },
          ui: {
            navLink: true,
          },
        },
        read: {
          app: ['kibana'],
          savedObject: {
            all: [],
            read: ['config', 'index-pattern', 'search', 'visualization'],
          },
          ui: {
            navLink: true,
          },
        },
      },
    },
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: 'dashboardApp',
    navLinkId: 'kibana:dashboard',
    privileges: {
      kibana: {
        all: {
          app: ['kibana'],
          savedObject: {
            all: ['dashboard'],
            read: ['config', 'index-pattern', 'search', 'visualization', 'timelion', 'canvas'],
          },
          ui: {
            navLink: true,
          },
        },
        read: {
          app: ['kibana'],
          savedObject: {
            all: [],
            read: [
              'config',
              'index-pattern',
              'search',
              'visualization',
              'timelion',
              'canvas',
              'dashboard',
            ],
          },
          ui: {
            navLink: true,
          },
        },
      },
    },
  },
  {
    id: 'dev_tools',
    name: 'Dev Tools',
    icon: 'devToolsApp',
    navLinkId: 'kibana:dev_tools',
    privileges: {
      kibana: {
        all: {
          api: ['console/execute'],
          app: ['kibana'],
          savedObject: {
            all: [],
            read: ['config'],
          },
          ui: {
            navLink: true,
          },
        },
      },
    },
  },
  {
    id: 'advancedSettings',
    name: 'Advanced Settings',
    icon: 'managementApp',
    navLinkId: 'kibana:management:advancedSettings',
    privileges: {
      kibana: {
        all: {
          app: ['kibana'],
          savedObject: {
            all: ['config'],
            read: [],
          },
          ui: {
            navLink: true,
          },
        },
      },
    },
  },
];

const timelionFeatures: Feature[] = [
  {
    id: 'timelion',
    name: 'Timelion',
    icon: 'timelionApp',
    navLinkId: 'timelion',
    privileges: {
      kibana: {
        all: {
          app: ['timelion'],
          savedObject: {
            all: ['timelion'],
            read: ['config', 'index-pattern'],
          },
          ui: {
            navLink: true,
          },
        },
        read: {
          app: ['timelion'],
          savedObject: {
            all: [],
            read: ['config', 'index-pattern', 'timelion'],
          },
          ui: {
            navLink: true,
          },
        },
      },
    },
  },
];

export function registerOssFeatures() {
  kibanaFeatures.forEach(registerFeature);
  timelionFeatures.forEach(registerFeature);
}
