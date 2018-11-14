/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { EuiButton } from '@elastic/eui';
import React, { Component, CSSProperties } from 'react';
import { uiCapabilities } from 'ui/capabilities';
import { MANAGE_SPACES_URL } from '../lib/constants';

interface Props {
  isDisabled?: boolean;
  className?: string;
  size?: 's' | 'l';
  style?: CSSProperties;
  onClick?: () => void;
}

export class ManageSpacesButton extends Component<Props, {}> {
  public render() {
    if (!uiCapabilities.spaces.manage) {
      return null;
    }

    return (
      <EuiButton
        size={this.props.size || 's'}
        className={this.props.className}
        isDisabled={this.props.isDisabled}
        onClick={this.navigateToManageSpaces}
        style={this.props.style}
      >
        Manage spaces
      </EuiButton>
    );
  }

  private navigateToManageSpaces = () => {
    if (this.props.onClick) {
      this.props.onClick();
    }
    window.location.replace(MANAGE_SPACES_URL);
  };
}
