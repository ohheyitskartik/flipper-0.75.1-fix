/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import Interactive, {InteractiveProps} from './Interactive';
import FlexColumn from './FlexColumn';
import {colors} from './colors';
import {Component, ReactNode} from 'react';
import styled from '@emotion/styled';
import {Property} from 'csstype';
import React from 'react';
import FlexRow from './FlexRow';
import {MoreOutlined} from '@ant-design/icons';
import {theme} from 'flipper-plugin';

const SidebarInteractiveContainer = styled(Interactive)<InteractiveProps>({
  flex: 'none',
});
SidebarInteractiveContainer.displayName = 'Sidebar:SidebarInteractiveContainer';

type SidebarPosition = 'left' | 'top' | 'right' | 'bottom';

const SidebarContainer = styled(FlexColumn)<{
  position: 'right' | 'top' | 'left' | 'bottom';
  backgroundColor?: Property.BackgroundClip;
  overflow?: boolean;
  unstyled?: boolean;
}>((props) => ({
  ...(props.unstyled
    ? undefined
    : {
        backgroundColor:
          props.backgroundColor || colors.macOSTitleBarBackgroundBlur,
        borderLeft: props.position === 'right' ? '1px solid #b3b3b3' : 'none',
        borderTop: props.position === 'bottom' ? '1px solid #b3b3b3' : 'none',
        borderRight: props.position === 'left' ? '1px solid #b3b3b3' : 'none',
        borderBottom: props.position === 'top' ? '1px solid #b3b3b3' : 'none',
      }),
  height: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
  textOverflow: props.overflow ? 'ellipsis' : 'auto',
  whiteSpace: props.overflow ? 'nowrap' : 'normal',
}));
SidebarContainer.displayName = 'Sidebar:SidebarContainer';

type SidebarProps = {
  /**
   * Position of the sidebar.
   */
  position: SidebarPosition;

  /**
   * Default width of the sidebar.  Only used for left/right sidebars.
   */
  width?: number;
  /**
   * Minimum sidebar width. Only used for left/right sidebars.
   */
  minWidth?: number;
  /**
   * Maximum sidebar width. Only used for left/right sidebars.
   */
  maxWidth?: number;

  /**
   * Default height of the sidebar.
   */
  height?: number;
  /**
   * Minimum sidebar height. Only used for top/bottom sidebars.
   */
  minHeight?: number;
  /**
   * Maximum sidebar height. Only used for top/bottom sidebars.
   */
  maxHeight?: number;

  /**
   * Background color.
   */
  backgroundColor?: Property.BackgroundColor;
  /**
   * Callback when the sidebar size ahs changed.
   */
  onResize?: (width: number, height: number) => void;
  /**
   * Contents of the sidebar.
   */
  children?: React.ReactNode;
  /**
   * Class name to customise styling.
   */
  className?: string;
  /**
   * use a Sandy themed large gutter
   */
  gutter?: boolean;
};

type SidebarState = {
  width?: Property.Width<number>;
  height?: Property.Height<number>;
  userChange: boolean;
};

/**
 * A resizable sidebar.
 */
export default class Sidebar extends Component<SidebarProps, SidebarState> {
  constructor(props: SidebarProps, context: Object) {
    super(props, context);
    this.state = {
      userChange: false,
      width: props.width,
      height: props.height,
    };
  }

  static defaultProps = {
    position: 'left',
  };

  static getDerivedStateFromProps(
    nextProps: SidebarProps,
    state: SidebarState,
  ) {
    if (!state.userChange) {
      return {width: nextProps.width, height: nextProps.height};
    }
    return null;
  }

  onResize = (width: number, height: number) => {
    const {onResize} = this.props;
    if (onResize) {
      onResize(width, height);
    } else {
      this.setState({userChange: true, width, height});
    }
  };

  render() {
    const {backgroundColor, onResize, position, children, gutter} = this.props;
    let height: number | undefined;
    let minHeight: number | undefined;
    let maxHeight: number | undefined;
    let width: number | undefined;
    let minWidth: number | undefined;
    let maxWidth: number | undefined;

    const resizable: {[key: string]: boolean} = {};
    if (position === 'left') {
      resizable.right = true;
      ({width, minWidth, maxWidth} = this.props);
    } else if (position === 'top') {
      resizable.bottom = true;
      ({height, minHeight, maxHeight} = this.props);
    } else if (position === 'right') {
      resizable.left = true;
      ({width, minWidth, maxWidth} = this.props);
    } else if (position === 'bottom') {
      resizable.top = true;
      ({height, minHeight, maxHeight} = this.props);
    }

    const horizontal = position === 'left' || position === 'right';
    const gutterWidth = gutter ? theme.space.large : 0;

    if (horizontal) {
      width = width == null ? 200 : width;
      minWidth = (minWidth == null ? 100 : minWidth) + gutterWidth;
      maxWidth = maxWidth == null ? 600 : maxWidth;
    } else {
      height = height == null ? 200 : height;
      minHeight = minHeight == null ? 100 : minHeight;
      maxHeight = maxHeight == null ? 600 : maxHeight;
    }
    return (
      <SidebarInteractiveContainer
        className={this.props.className}
        minWidth={minWidth}
        maxWidth={maxWidth}
        width={
          horizontal
            ? !children
              ? gutterWidth
              : onResize
              ? width
              : this.state.width
            : undefined
        }
        minHeight={minHeight}
        maxHeight={maxHeight}
        height={
          !horizontal
            ? onResize
              ? height
              : this.state.height
            : gutter /*TODO: should use isSandy check*/
            ? undefined
            : '100%'
        }
        resizable={resizable}
        onResize={this.onResize}
        gutterWidth={gutter ? theme.space.large : undefined}>
        <SidebarContainer
          position={position}
          backgroundColor={backgroundColor}
          unstyled={gutter}>
          {gutter ? (
            <GutterWrapper position={position}>{children}</GutterWrapper>
          ) : (
            children
          )}
        </SidebarContainer>
      </SidebarInteractiveContainer>
    );
  }
}

const GutterWrapper = ({
  position,
  children,
}: {
  position: SidebarPosition;
  children: ReactNode;
}) => {
  return position === 'right' ? (
    <FlexRow grow>
      <VerticalGutter enabled={!!children} />
      {children}
    </FlexRow>
  ) : (
    <FlexRow grow>
      {children}
      <VerticalGutter enabled={!!children} />
    </FlexRow>
  ); // TODO: support top / bottom
};

const VerticalGutterContainer = styled('div')<{enabled: boolean}>(
  ({enabled}) => ({
    width: theme.space.large,
    minWidth: theme.space.large,
    height: '100%',
    cursor: enabled ? undefined : 'default', // hide cursor from interactive container
    color: enabled ? theme.textColorPlaceholder : theme.backgroundWash,
    fontSize: '16px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    background: theme.backgroundWash,
    ':hover': {
      background: enabled ? theme.dividerColor : undefined,
    },
  }),
);
const VerticalGutter = ({enabled}: {enabled: boolean}) => (
  <VerticalGutterContainer enabled={enabled}>
    <MoreOutlined />
  </VerticalGutterContainer>
);
