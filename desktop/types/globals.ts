/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {StoreEnhancerStoreCreator} from 'redux';
import {ResizeObserver} from './ResizeObserver.d';
import {Store} from '../app/src/reducers';

export {};

declare global {
  interface StoreEnhancerStateSanitizer {
    stateSanitizer: Function;
  }

  interface Window {
    flipperGlobalStoreDispatch: Store['dispatch'];

    __REDUX_DEVTOOLS_EXTENSION__:
      | undefined
      | (StoreEnhancerStoreCreator & StoreEnhancerStateSanitizer);

    Flipper: {
      init: () => void;
    };

    ResizeObserver: ResizeObserver;
  }
}
