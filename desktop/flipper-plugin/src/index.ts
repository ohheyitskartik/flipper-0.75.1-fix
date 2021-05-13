/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

export {produce, Draft} from 'immer';
import styledImport from '@emotion/styled';
export const styled = styledImport;

import './plugin/PluginBase';
import * as TestUtilites from './test-utils/test-utils';

export {
  SandyPluginInstance as _SandyPluginInstance,
  PluginClient,
} from './plugin/Plugin';
export {
  Device,
  DeviceLogEntry,
  DeviceLogListener,
  DevicePluginClient,
  LogLevel,
  SandyDevicePluginInstance as _SandyDevicePluginInstance,
  DeviceType,
} from './plugin/DevicePlugin';
export {SandyPluginDefinition as _SandyPluginDefinition} from './plugin/SandyPluginDefinition';
export {SandyPluginRenderer as _SandyPluginRenderer} from './plugin/PluginRenderer';
export {
  SandyPluginContext as _SandyPluginContext,
  usePlugin,
} from './plugin/PluginContext';
export {createState, useValue, Atom} from './state/atom';
export {batch} from './state/batch';
export {FlipperLib} from './plugin/FlipperLib';
export {
  MenuEntry,
  NormalizedMenuEntry,
  buildInMenuEntries as _buildInMenuEntries,
  DefaultKeyboardAction,
} from './plugin/MenuEntry';

export {theme} from './ui/theme';
export {Layout} from './ui/Layout';
export {
  NUX,
  NuxManagerContext as _NuxManagerContext,
  createNuxManager as _createNuxManager,
} from './ui/NUX';

export {renderReactRoot} from './utils/renderReactRoot';
export {
  Tracked,
  TrackingScope,
  setGlobalInteractionReporter as _setGlobalInteractionReporter,
  withTrackingScope,
  useTrackedCallback,
  wrapInteractionHandler as _wrapInteractionHandler,
} from './ui/Tracked';

export {sleep} from './utils/sleep';
export {
  LogTypes,
  TrackType,
  Logger,
  useLogger,
  _LoggerContext,
} from './utils/Logger';
export {Idler} from './utils/Idler';

// It's not ideal that this exists in flipper-plugin sources directly,
// but is the least pain for plugin authors.
// Probably we should make sure that testing-library doesn't end up in our final Flipper bundle (which packages flipper-plugin)
// T69106962
export const TestUtils = TestUtilites;
