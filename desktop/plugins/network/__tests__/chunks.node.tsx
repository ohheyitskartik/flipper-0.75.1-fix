/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {combineBase64Chunks} from '../chunks';
import {TestUtils} from 'flipper-plugin';
import * as NetworkPlugin from '..';

test('Test assembling base64 chunks', () => {
  const message = 'wassup john?';
  const chunks = message.match(/.{1,2}/g)?.map(btoa);

  if (chunks === undefined) {
    throw new Error('invalid chunks');
  }

  const output = combineBase64Chunks(chunks);
  expect(output).toBe('wassup john?');
});

test('Reducer correctly adds initial chunk', () => {
  const {instance, sendEvent} = TestUtils.startPlugin(NetworkPlugin);
  expect(instance.partialResponses.get()).toEqual({});

  sendEvent('partialResponse', {
    id: '1',
    timestamp: 123,
    status: 200,
    data: 'hello',
    reason: 'nothing',
    headers: [],
    isMock: false,
    insights: null,
    index: 0,
    totalChunks: 2,
  });

  expect(instance.partialResponses.get()['1']).toMatchInlineSnapshot(`
    Object {
      "followupChunks": Object {},
      "initialResponse": Object {
        "data": "hello",
        "headers": Array [],
        "id": "1",
        "index": 0,
        "insights": null,
        "isMock": false,
        "reason": "nothing",
        "status": 200,
        "timestamp": 123,
        "totalChunks": 2,
      },
    }
  `);
});

test('Reducer correctly adds followup chunk', () => {
  const {instance, sendEvent} = TestUtils.startPlugin(NetworkPlugin);
  expect(instance.partialResponses.get()).toEqual({});

  sendEvent('partialResponse', {
    id: '1',
    totalChunks: 2,
    index: 1,
    data: 'hello',
  });
  expect(instance.partialResponses.get()['1']).toMatchInlineSnapshot(`
    Object {
      "followupChunks": Object {
        "1": "hello",
      },
    }
  `);
});

test('Reducer correctly combines initial response and followup chunk', () => {
  const {instance, sendEvent} = TestUtils.startPlugin(NetworkPlugin);
  instance.partialResponses.set({
    '1': {
      followupChunks: {},
      initialResponse: {
        data: 'aGVs',
        headers: [],
        id: '1',
        insights: null,
        isMock: false,
        reason: 'nothing',
        status: 200,
        timestamp: 123,
        index: 0,
        totalChunks: 2,
      },
    },
  });
  expect(instance.responses.get()).toEqual({});
  sendEvent('partialResponse', {
    id: '1',
    totalChunks: 2,
    index: 1,
    data: 'bG8=',
  });

  expect(instance.partialResponses.get()).toEqual({});
  expect(instance.responses.get()['1']).toMatchInlineSnapshot(`
    Object {
      "data": "aGVsbG8=",
      "headers": Array [],
      "id": "1",
      "index": 0,
      "insights": null,
      "isMock": false,
      "reason": "nothing",
      "status": 200,
      "timestamp": 123,
      "totalChunks": 2,
    }
  `);
});
