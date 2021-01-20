/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * and the Server Side Public License, v 1; you may not use this file except in
 * compliance with, at your election, the Elastic License or the Server Side
 * Public License, v 1.
 */

import React from 'react';
import { mount, shallow } from 'enzyme';
import { DocViewer } from './doc_viewer';
import { findTestSubject } from '@elastic/eui/lib/test';
import { getDocViewsRegistry } from '../../../kibana_services';
import { DocViewRenderProps } from '../../doc_views/doc_views_types';

jest.mock('../../../kibana_services', () => {
  let registry: any[] = [];
  return {
    getDocViewsRegistry: () => ({
      addDocView(view: any) {
        registry.push(view);
      },
      getDocViewsSorted() {
        return registry;
      },
      resetRegistry: () => {
        registry = [];
      },
    }),
  };
});

beforeEach(() => {
  (getDocViewsRegistry() as any).resetRegistry();
  jest.clearAllMocks();
});

test('Render <DocViewer/> with 3 different tabs', () => {
  const registry = getDocViewsRegistry();
  registry.addDocView({ order: 10, title: 'Render function', render: jest.fn() });
  registry.addDocView({ order: 20, title: 'React component', component: () => <div>test</div> });
  registry.addDocView({ order: 30, title: 'Invalid doc view' });

  const renderProps = { hit: {} } as DocViewRenderProps;

  const wrapper = shallow(<DocViewer {...renderProps} />);

  expect(wrapper).toMatchSnapshot();
});

test('Render <DocViewer/> with 1 tab displaying error message', () => {
  function SomeComponent() {
    // this is just a placeholder
    return null;
  }

  const registry = getDocViewsRegistry();
  registry.addDocView({
    order: 10,
    title: 'React component',
    component: SomeComponent,
  });

  const renderProps = { hit: {} } as DocViewRenderProps;
  const errorMsg = 'Catch me if you can!';

  const wrapper = mount(<DocViewer {...renderProps} />);
  const error = new Error(errorMsg);
  wrapper.find(SomeComponent).simulateError(error);
  const errorMsgComponent = findTestSubject(wrapper, 'docViewerError');
  expect(errorMsgComponent.text()).toMatch(new RegExp(`${errorMsg}`));
});
