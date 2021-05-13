/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import React from 'react';
import {create, act, ReactTestRenderer} from 'react-test-renderer';
import {Provider} from 'react-redux';
import ExportDataPluginSheet from '../ExportDataPluginSheet';
import {FlipperPlugin, FlipperDevicePlugin} from '../../plugin';
import {getExportablePlugins, getPluginKey} from '../../utils/pluginUtils';
import {createMockFlipperWithPlugin} from '../../test-utils/createMockFlipperWithPlugin';
import {setPluginState} from '../../reducers/pluginStates';

class TestPlugin extends FlipperPlugin<any, any, any> {
  static details = {
    title: 'TestPlugin',
    id: 'TestPlugin',
  } as any;
}
TestPlugin.title = 'TestPlugin';
TestPlugin.id = 'TestPlugin';
TestPlugin.defaultPersistedState = {msg: 'Test plugin'};

class TestDevicePlugin extends FlipperDevicePlugin<any, any, any> {
  static details = {
    title: 'TestDevicePlugin',
    id: 'TestDevicePlugin',
  } as any;

  static supportsDevice() {
    return true;
  }
}
TestDevicePlugin.title = 'TestDevicePlugin';
TestDevicePlugin.id = 'TestDevicePlugin';
TestDevicePlugin.defaultPersistedState = {msg: 'TestDevicePlugin'};

test('SettingsSheet snapshot with nothing enabled', async () => {
  let root: ReactTestRenderer;
  const {
    store,
    togglePlugin,
    client,
    device,
    pluginKey,
  } = await createMockFlipperWithPlugin(TestPlugin, {
    additionalPlugins: [TestDevicePlugin],
  });

  togglePlugin();

  store.dispatch(
    setPluginState({
      pluginKey,
      state: {test: '1'},
    }),
  );

  expect(getExportablePlugins(store.getState(), device, client)).toEqual([]);

  // makes device plugin visible
  store.dispatch(
    setPluginState({
      pluginKey: getPluginKey(undefined, device, 'TestDevicePlugin'),
      state: {test: '1'},
    }),
  );

  expect(getExportablePlugins(store.getState(), device, client)).toEqual([
    {
      id: 'TestDevicePlugin',
      label: 'TestDevicePlugin',
    },
  ]);

  await act(async () => {
    root = create(
      <Provider store={store}>
        <ExportDataPluginSheet onHide={() => {}} />
      </Provider>,
    );
  });

  expect(root!.toJSON()).toMatchSnapshot();
});

test('SettingsSheet snapshot with one plugin enabled', async () => {
  let root: ReactTestRenderer;
  const {store, device, client, pluginKey} = await createMockFlipperWithPlugin(
    TestPlugin,
    {
      additionalPlugins: [TestDevicePlugin],
    },
  );

  // enabled, but no data
  expect(getExportablePlugins(store.getState(), device, client)).toEqual([]);

  store.dispatch(
    setPluginState({
      pluginKey,
      state: {test: '1'},
    }),
  );
  store.dispatch(
    setPluginState({
      pluginKey: getPluginKey(undefined, device, 'TestDevicePlugin'),
      state: {test: '1'},
    }),
  );
  expect(getExportablePlugins(store.getState(), device, client)).toEqual([
    {
      id: 'TestDevicePlugin',
      label: 'TestDevicePlugin',
    },
    {
      id: 'TestPlugin',
      label: 'TestPlugin',
    },
  ]);

  await act(async () => {
    root = create(
      <Provider store={store}>
        <ExportDataPluginSheet onHide={() => {}} />
      </Provider>,
    );
  });

  expect(root!.toJSON()).toMatchSnapshot();
});
