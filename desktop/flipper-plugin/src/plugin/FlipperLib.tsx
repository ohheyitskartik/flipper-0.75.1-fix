/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {Logger} from '../utils/Logger';
import {RealFlipperDevice} from './DevicePlugin';
import {NormalizedMenuEntry} from './MenuEntry';
import {RealFlipperClient} from './Plugin';

/**
 * This interface exposes all global methods for which an implementation will be provided by Flipper itself
 */
export interface FlipperLib {
  logger: Logger;
  enableMenuEntries(menuEntries: NormalizedMenuEntry[]): void;
  createPaste(input: string): Promise<string | undefined>;
  GK(gatekeeper: string): boolean;
  isPluginAvailable(
    device: RealFlipperDevice,
    client: RealFlipperClient | null,
    pluginId: string,
  ): boolean;
  selectPlugin(
    device: RealFlipperDevice,
    client: RealFlipperClient | null,
    pluginId: string,
    deeplink: unknown,
  ): void;
}
