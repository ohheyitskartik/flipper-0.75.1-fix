/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {Atom, createState} from 'flipper-plugin';
import {User} from '../reducers/user';

export async function getUser(): Promise<User> {
  throw new Error('Feature not implemented');
}

export async function internGraphPOSTAPIRequest(
  _endpoint: string,
  _formFields: {
    [key: string]: any;
  } = {},
  _internGraphUrl?: string,
): Promise<any> {
  throw new Error('Feature not implemented');
}

export async function internGraphGETAPIRequest(
  _endpoint: string,
  _params: {
    [key: string]: any;
  } = {},
  _internGraphUrl?: string,
): Promise<any> {
  throw new Error('Feature not implemented');
}

export async function graphQLQuery(_query: string): Promise<any> {
  throw new Error('Feature not implemented');
}

export function logoutUser(): Promise<void> {
  throw new Error('Feature not implemented');
}

export type DataExportResult = {
  id: string;
  os: 'string';
  deviceType: string;
  plugins: string[];
  fileUrl: string;
  flipperUrl: string;
};

export type DataExportError = {
  error: string;
  error_class: string;
  stacktrace: string;
};

export async function shareFlipperData(
  _trace: string,
): Promise<DataExportError | DataExportResult> {
  new Notification('Feature not implemented');
  throw new Error('Feature not implemented');
}

export async function writeKeychain(_token: string) {
  throw new Error('Feature not implemented');
}

export async function uploadFlipperMedia(
  _path: string,
  _kind: 'Image' | 'Video',
): Promise<string> {
  throw new Error('Feature not implemented');
}
export async function getFlipperMediaCDN(
  _uploadID: string,
  _kind: 'Image' | 'Video',
): Promise<string> {
  throw new Error('Feature not implemented');
}

export async function getPreferredEditorUriScheme(): Promise<string> {
  return 'vscode';
}

export async function appendAccessTokenToUrl(_url: URL): Promise<string> {
  throw new Error('Implement appendAccessTokenToUrl');
}

const isLoggedInAtom = createState(false);

export function isLoggedIn(): Atom<boolean> {
  return isLoggedInAtom;
}
