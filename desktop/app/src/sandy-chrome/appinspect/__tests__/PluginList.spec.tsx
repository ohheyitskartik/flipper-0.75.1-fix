/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {
  createMockFlipperWithPlugin,
  MockFlipperResult,
} from '../../../test-utils/createMockFlipperWithPlugin';
import {findBestClient, findBestDevice, findMetroDevice} from '../AppInspect';
import {FlipperPlugin} from '../../../plugin';
import MetroDevice from '../../../devices/MetroDevice';
import BaseDevice from '../../../devices/BaseDevice';
import {_SandyPluginDefinition} from 'flipper-plugin';
import {createMockPluginDetails} from 'flipper-plugin/src/test-utils/test-utils';
import {selectPlugin, starPlugin} from '../../../reducers/connections';
import {registerMetroDevice} from '../../../dispatcher/metroDevice';
import {
  addGatekeepedPlugins,
  registerMarketplacePlugins,
  registerPlugins,
} from '../../../reducers/plugins';

// eslint-disable-next-line
import * as LogsPluginModule from '../../../../../plugins/logs/index';
import {createMockDownloadablePluginDetails} from '../../../utils/testUtils';
import {computePluginLists} from '../../../utils/pluginUtils';

const logsPlugin = new _SandyPluginDefinition(
  createMockPluginDetails({id: 'DeviceLogs'}),
  LogsPluginModule,
);

class TestPlugin extends FlipperPlugin<any, any, any> {}

describe('basic findBestDevice', () => {
  let flipper: MockFlipperResult;
  beforeEach(async () => {
    flipper = await createMockFlipperWithPlugin(TestPlugin);
  });

  test('findBestDevice prefers selected device', () => {
    const {client, device} = flipper;
    const {connections} = flipper.store.getState();
    expect(
      findBestDevice(
        client,
        connections.devices,
        device,
        undefined,
        device.title,
      ),
    ).toBe(device);
  });

  test('findBestDevice picks device of current client', () => {
    const {client, device} = flipper;
    const {connections} = flipper.store.getState();
    expect(
      findBestDevice(client, connections.devices, null, undefined, null),
    ).toBe(device);
  });

  test('findBestDevice picks preferred device if no client and device', () => {
    const {device} = flipper;
    const {connections} = flipper.store.getState();
    expect(
      findBestDevice(
        undefined,
        connections.devices,
        null,
        undefined,
        device.title,
      ),
    ).toBe(device);
  });
});

describe('basic findBestDevice with metro present', () => {
  let flipper: MockFlipperResult;
  let metro: MetroDevice;
  let testDevice: BaseDevice;

  beforeEach(async () => {
    flipper = await createMockFlipperWithPlugin(logsPlugin);
    testDevice = flipper.device;
    // flipper.store.dispatch(registerPlugins([LogsPlugin]))
    await registerMetroDevice(undefined, flipper.store, flipper.logger);
    metro = findMetroDevice(
      flipper.store.getState().connections.devices,
    )! as MetroDevice;
  });

  test('findMetroDevice', () => {
    expect(metro).toBeInstanceOf(MetroDevice);
  });

  test('correct base selection state', () => {
    const {connections} = flipper.store.getState();
    expect(connections).toMatchObject({
      devices: [testDevice, metro],
      selectedDevice: testDevice,
      selectedPlugin: 'DeviceLogs',
      userPreferredDevice: 'MockAndroidDevice',
      userPreferredPlugin: 'DeviceLogs',
      userPreferredApp: 'TestApp#Android#MockAndroidDevice#serial',
    });
    expect(
      findBestClient(
        connections.clients,
        connections.selectedApp,
        connections.userPreferredApp,
      ),
    ).toBe(flipper.client);
  });

  test('selecting Metro Logs works but keeps normal device preferred', () => {
    flipper.store.dispatch(
      selectPlugin({
        selectedPlugin: logsPlugin.id,
        selectedApp: null,
        selectedDevice: metro,
        deepLinkPayload: null,
      }),
    );
    expect(flipper.store.getState().connections).toMatchObject({
      devices: [testDevice, metro],
      selectedApp: null,
      selectedDevice: metro,
      selectedPlugin: 'DeviceLogs',
      userPreferredDevice: 'MockAndroidDevice', // Not metro!
      userPreferredPlugin: 'DeviceLogs',
      userPreferredApp: 'TestApp#Android#MockAndroidDevice#serial',
    });
    const {connections} = flipper.store.getState();
    // find best device is still metro
    expect(
      findBestDevice(
        undefined,
        connections.devices,
        connections.selectedDevice,
        metro,
        connections.userPreferredDevice,
      ),
    ).toBe(testDevice);
    // find best client still returns app
    expect(
      findBestClient(
        connections.clients,
        connections.selectedApp,
        connections.userPreferredApp,
      ),
    ).toBe(flipper.client);
  });

  test('computePluginLists', () => {
    const state = flipper.store.getState();
    expect(
      computePluginLists(
        testDevice,
        metro,
        flipper.client,
        state.plugins,
        state.connections.userStarredPlugins,
      ),
    ).toEqual({
      downloadablePlugins: [],
      devicePlugins: [logsPlugin],
      metroPlugins: [logsPlugin],
      enabledPlugins: [],
      disabledPlugins: [],
      unavailablePlugins: [],
    });
  });

  test('computePluginLists with problematic plugins', () => {
    const noopPlugin = {
      plugin() {},
      Component() {
        return null;
      },
    };

    const unsupportedDevicePlugin = new _SandyPluginDefinition(
      createMockPluginDetails({
        id: 'unsupportedDevicePlugin',
        title: 'Unsupported Device Plugin',
      }),
      {
        devicePlugin() {
          return {};
        },
        supportsDevice() {
          return false;
        },
        Component() {
          return null;
        },
      },
    );
    const unsupportedPlugin = new _SandyPluginDefinition(
      createMockPluginDetails({
        id: 'unsupportedPlugin',
        title: 'Unsupported Plugin',
      }),
      noopPlugin,
    );

    const gateKeepedPlugin = createMockPluginDetails({
      id: 'gateKeepedPlugin',
      title: 'Gatekeeped Plugin',
      gatekeeper: 'not for you',
    });

    const plugin1 = new _SandyPluginDefinition(
      createMockPluginDetails({
        id: 'plugin1',
        title: 'Plugin 1',
      }),
      {
        plugin() {},
        Component() {
          return null;
        },
      },
    );

    const plugin2 = new _SandyPluginDefinition(
      createMockPluginDetails({
        id: 'plugin2',
        title: 'Plugin 2',
      }),
      noopPlugin,
    );

    const supportedDownloadablePlugin = createMockDownloadablePluginDetails({
      id: 'supportedUninstalledPlugin',
      title: 'Supported Uninstalled Plugin',
    });

    const unsupportedDownloadablePlugin = createMockDownloadablePluginDetails({
      id: 'unsupportedUninstalledPlugin',
      title: 'Unsupported Uninstalled Plugin',
    });

    flipper.store.dispatch(
      registerPlugins([
        unsupportedDevicePlugin,
        unsupportedPlugin,
        plugin1,
        plugin2,
      ]),
    );
    flipper.store.dispatch(addGatekeepedPlugins([gateKeepedPlugin]));
    flipper.store.dispatch(
      registerMarketplacePlugins([
        supportedDownloadablePlugin,
        unsupportedDownloadablePlugin,
      ]),
    );

    // ok, this is a little hackish
    flipper.client.plugins = [
      'plugin1',
      'plugin2',
      'supportedUninstalledPlugin',
    ];

    let state = flipper.store.getState();
    const pluginLists = computePluginLists(
      testDevice,
      metro,
      flipper.client,
      state.plugins,
      state.connections.userStarredPlugins,
    );
    expect(pluginLists).toEqual({
      devicePlugins: [logsPlugin],
      metroPlugins: [logsPlugin],
      enabledPlugins: [],
      disabledPlugins: [plugin1, plugin2],
      unavailablePlugins: [
        [
          gateKeepedPlugin,
          "This plugin is only available to members of gatekeeper 'not for you'",
        ],
        [
          unsupportedDevicePlugin.details,
          "Device plugin 'Unsupported Device Plugin' is not supported by the current device type.",
        ],
        [
          unsupportedPlugin.details,
          "Plugin 'Unsupported Plugin' is installed in Flipper, but not supported by the client application",
        ],
        [
          unsupportedDownloadablePlugin,
          "Plugin 'Unsupported Uninstalled Plugin' is not installed in Flipper and not supported by the client application",
        ],
      ],
      downloadablePlugins: [supportedDownloadablePlugin],
    });

    flipper.store.dispatch(
      starPlugin({
        plugin: plugin2,
        selectedApp: flipper.client.query.app,
      }),
    );
    state = flipper.store.getState();
    expect(
      computePluginLists(
        testDevice,
        metro,
        flipper.client,
        state.plugins,
        state.connections.userStarredPlugins,
      ),
    ).toMatchObject({
      enabledPlugins: [plugin2],
      disabledPlugins: [plugin1],
    });
  });
});
