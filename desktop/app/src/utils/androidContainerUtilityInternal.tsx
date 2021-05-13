/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

/*
 * This file is intentionally separate from androidContainerUtility so the
 * opaque types will ensure the commands are only ever run on validated
 * arguments.
 */
import {UnsupportedError} from './metrics';
import adbkit, {Client} from 'adbkit';

const allowedAppNameRegex = /^[\w.-]+$/;
const appNotApplicationRegex = /not an application/;
const appNotDebuggableRegex = /debuggable/;
const operationNotPermittedRegex = /not permitted/;
const logTag = 'androidContainerUtility';

export type AppName = string;
export type Command = string;
export type FilePath = string;
export type FileContent = string;

export function validateAppName(app: string): Promise<AppName> {
  if (app.match(allowedAppNameRegex)) {
    return Promise.resolve(app);
  }
  return Promise.reject(new Error(`Disallowed run-as user: ${app}`));
}

export function validateFilePath(filePath: string): Promise<FilePath> {
  if (!filePath.match(/[']/)) {
    return Promise.resolve(filePath);
  }
  return Promise.reject(new Error(`Disallowed escaping filepath: ${filePath}`));
}

export function validateFileContent(content: string): Promise<FileContent> {
  if (!content.match(/["]/)) {
    return Promise.resolve(content);
  }
  return Promise.reject(
    new Error(`Disallowed escaping file content: ${content}`),
  );
}

enum RunAsErrorCode {
  NotAnApp = 1,
  NotDebuggable = 2,
}

class RunAsError extends Error {
  code: RunAsErrorCode;

  constructor(code: RunAsErrorCode, message?: string) {
    super(message);
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function _push(
  client: Client,
  deviceId: string,
  app: AppName,
  filename: FilePath,
  contents: FileContent,
): Promise<void> {
  console.debug(`Deploying ${filename} to ${deviceId}:${app}`, logTag);
  const command = `echo "${contents}" > '${filename}' && chmod 644 '${filename}'`;
  return executeCommandAsApp(client, deviceId, app, command)
    .then((_) => undefined)
    .catch((error) => {
      if (error instanceof RunAsError) {
        // Fall back to running the command directly. This will work if adb is running as root.
        return executeCommandWithSu(client, deviceId, app, command)
          .then((_) => undefined)
          .catch((e) => {
            console.debug(e);
            throw error;
          });
      }
      throw error;
    });
}

export function _pull(
  client: Client,
  deviceId: string,
  app: AppName,
  path: FilePath,
): Promise<string> {
  const command = `cat '${path}'`;
  return executeCommandAsApp(client, deviceId, app, command).catch((error) => {
    if (error instanceof RunAsError) {
      // Fall back to running the command directly. This will work if adb is running as root.
      return executeCommandWithSu(client, deviceId, app, command).catch((e) => {
        // Throw the original error.
        console.debug(e);
        throw error;
      });
    }
    throw error;
  });
}

// Keep this method private since it relies on pre-validated arguments
function executeCommandAsApp(
  client: Client,
  deviceId: string,
  app: string,
  command: string,
): Promise<string> {
  return _executeCommandWithRunner(
    client,
    deviceId,
    app,
    command,
    `run-as '${app}'`,
  );
}

function executeCommandWithSu(
  client: Client,
  deviceId: string,
  app: string,
  command: string,
): Promise<string> {
  return _executeCommandWithRunner(client, deviceId, app, command, 'su');
}

function _executeCommandWithRunner(
  client: Client,
  deviceId: string,
  app: string,
  command: string,
  runner: string,
): Promise<string> {
  return client
    .shell(deviceId, `echo '${command}' | ${runner}`)
    .then(adbkit.util.readAll)
    .then((buffer) => buffer.toString())
    .then((output) => {
      if (output.match(appNotApplicationRegex)) {
        throw new RunAsError(
          RunAsErrorCode.NotAnApp,
          `Android package ${app} is not an application. To use it with Flipper, either run adb as root or add an <application> tag to AndroidManifest.xml`,
        );
      }
      if (output.match(appNotDebuggableRegex)) {
        throw new RunAsError(
          RunAsErrorCode.NotDebuggable,
          `Android app ${app} is not debuggable. To use it with Flipper, add android:debuggable="true" to the application section of AndroidManifest.xml`,
        );
      }
      if (output.toLowerCase().match(operationNotPermittedRegex)) {
        throw new UnsupportedError(
          `Your android device (${deviceId}) does not support the adb shell run-as command. We're tracking this at https://github.com/facebook/flipper/issues/92`,
        );
      }
      return output;
    });
}
