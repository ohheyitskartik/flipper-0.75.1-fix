/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {PureComponent, Fragment} from 'react';
import {Logger} from '../fb-interfaces/Logger';
import {connect} from 'react-redux';
import {State as Store} from '../reducers/index';
import {ConnectedNotificationsTable} from '../NotificationsHub';
import {Button, colors, styled, FlexColumn} from '../ui';
import {clearAllNotifications} from '../reducers/notifications';
import {selectPlugin} from '../reducers/connections';
import React from 'react';

type StateFromProps = {
  deepLinkPayload: unknown;
  blocklistedPlugins: Array<string>;
  blocklistedCategories: Array<string>;
};

type DispatchFromProps = {
  clearAllNotifications: () => void;
  selectPlugin: (payload: {
    selectedPlugin: string | null;
    selectedApp: string | null | undefined;
    deepLinkPayload: unknown;
  }) => any;
};

type OwnProps = {
  logger: Logger;
};

type Props = StateFromProps & DispatchFromProps & OwnProps;

type State = {};

const Container = styled(FlexColumn)({
  width: 0,
  flexGrow: 1,
  flexShrink: 1,
  backgroundColor: colors.white,
});

class Notifications extends PureComponent<Props, State> {
  render() {
    const {
      blocklistedPlugins,
      blocklistedCategories,
      deepLinkPayload,
      logger,
      clearAllNotifications,
      selectPlugin,
    } = this.props;
    return (
      <React.Fragment>
        <Container>
          <ConnectedNotificationsTable
            onClear={clearAllNotifications}
            selectedID={
              typeof deepLinkPayload === 'string' ? deepLinkPayload : null
            }
            onSelectPlugin={selectPlugin}
            logger={logger}
            defaultFilters={[
              ...blocklistedPlugins.map((value) => ({
                value,
                type: 'exclude',
                key: 'plugin',
              })),
              ...blocklistedCategories.map((value) => ({
                value,
                type: 'exclude',
                key: 'category',
              })),
            ]}
            actions={
              <Fragment>
                <Button onClick={clearAllNotifications}>Clear</Button>
              </Fragment>
            }
          />
        </Container>
      </React.Fragment>
    );
  }
}

export default connect<StateFromProps, DispatchFromProps, OwnProps, Store>(
  ({
    connections: {deepLinkPayload},
    notifications: {blocklistedPlugins, blocklistedCategories},
  }) => ({
    deepLinkPayload,
    blocklistedPlugins,
    blocklistedCategories,
  }),
  {clearAllNotifications, selectPlugin},
)(Notifications);
