/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import {
  FlexRow,
  FlexColumn,
  Layout,
  Button,
  Input,
  Text,
  Tabs,
  Tab,
  Glyph,
  ManagedTable,
  Select,
  styled,
  colors,
  produce,
} from 'flipper';
import React, {useContext, useState} from 'react';
import {NetworkRouteContext, NetworkRouteManager} from './index';
import {RequestId, Route} from './types';

type Props = {
  id: RequestId;
  route: Route;
  isDuplicated: boolean;
};

const StyledSelectContainer = styled(FlexRow)({
  paddingLeft: 6,
  paddingTop: 2,
  paddingBottom: 24,
  height: '100%',
  flexGrow: 1,
});

const StyledSelect = styled(Select)({
  height: '100%',
  maxWidth: 400,
});

const StyledText = styled(Text)({
  marginLeft: 6,
  marginTop: 8,
});

const textAreaStyle: React.CSSProperties = {
  width: '100%',
  marginTop: 8,
  height: 400,
  fontSize: 15,
  color: '#333',
  padding: 10,
  resize: 'none',
  fontFamily:
    'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
  display: 'inline-block',
  lineHeight: 1.5,
  border: '1px solid #dcdee2',
  borderRadius: 4,
  backgroundColor: '#fff',
  cursor: 'text',
  WebkitTapHighlightColor: 'transparent',
  whiteSpace: 'pre-wrap',
  overflowWrap: 'break-word',
};

const StyledInput = styled(Input)({
  width: '100%',
  height: 20,
  marginLeft: 8,
  flexGrow: 5,
});

const HeaderStyledInput = styled(Input)({
  width: '100%',
  height: 20,
  marginTop: 6,
  marginBottom: 6,
});

const HeaderGlyph = styled(Glyph)({
  marginTop: 6,
  marginBottom: 6,
});

const Container = styled(FlexColumn)({
  flexWrap: 'nowrap',
  alignItems: 'flex-start',
  alignContent: 'flex-start',
  flexGrow: 1,
  overflow: 'hidden',
});

const Warning = styled(FlexRow)({
  marginTop: 8,
});

const HeadersColumnSizes = {
  close: '4%',
  warning: '4%',
  name: '35%',
  value: 'flex',
};

const HeadersColumns = {
  close: {
    value: '',
    resizable: false,
  },
  warning: {
    value: '',
    resizable: false,
  },
  name: {
    value: 'Name',
    resizable: false,
  },
  value: {
    value: 'Value',
    resizable: false,
  },
};

const selectedHighlight = {backgroundColor: colors.highlight};

function HeaderInput(props: {
  initialValue: string;
  isSelected: boolean;
  onUpdate: (newValue: string) => void;
}) {
  const [value, setValue] = useState(props.initialValue);
  return (
    <HeaderStyledInput
      type="text"
      placeholder="Name"
      value={value}
      style={props.isSelected ? selectedHighlight : undefined}
      onChange={(event) => setValue(event.target.value)}
      onBlur={() => props.onUpdate(value)}
    />
  );
}

function _buildMockResponseHeaderRows(
  routeId: string,
  route: Route,
  selectedHeaderId: string | null,
  networkRouteManager: NetworkRouteManager,
) {
  return Object.entries(route.responseHeaders).map(([id, header]) => {
    const selected = selectedHeaderId === id;
    return {
      columns: {
        name: {
          value: (
            <HeaderInput
              initialValue={header.key}
              isSelected={selected}
              onUpdate={(newValue: string) => {
                const newHeaders = produce(
                  route.responseHeaders,
                  (draftHeaders) => {
                    draftHeaders[id].key = newValue;
                  },
                );
                networkRouteManager.modifyRoute(routeId, {
                  responseHeaders: newHeaders,
                });
              }}
            />
          ),
        },
        value: {
          value: (
            <HeaderInput
              initialValue={header.value}
              isSelected={selected}
              onUpdate={(newValue: string) => {
                const newHeaders = produce(
                  route.responseHeaders,
                  (draftHeaders) => {
                    draftHeaders[id].value = newValue;
                  },
                );
                networkRouteManager.modifyRoute(routeId, {
                  responseHeaders: newHeaders,
                });
              }}
            />
          ),
        },
        close: {
          value: (
            <Layout.Container
              onClick={() => {
                const newHeaders = produce(
                  route.responseHeaders,
                  (draftHeaders) => {
                    delete draftHeaders[id];
                  },
                );
                networkRouteManager.modifyRoute(routeId, {
                  responseHeaders: newHeaders,
                });
              }}>
              <HeaderGlyph name="cross-circle" color={colors.red} />
            </Layout.Container>
          ),
        },
      },
      key: id,
    };
  });
}

export function MockResponseDetails({id, route, isDuplicated}: Props) {
  const networkRouteManager = useContext(NetworkRouteContext);
  const [activeTab, setActiveTab] = useState<string>('data');
  const [selectedHeaderIds, setSelectedHeaderIds] = useState<Array<RequestId>>(
    [],
  );
  const [nextHeaderId, setNextHeaderId] = useState(0);

  const {requestUrl, requestMethod, responseData, responseStatus} = route;

  let formattedResponse = '';
  try {
    formattedResponse = JSON.stringify(JSON.parse(responseData), null, 2);
  } catch (e) {
    formattedResponse = responseData;
  }

  return (
    <Container>
      <FlexRow style={{width: '100%'}}>
        <StyledSelectContainer>
          <StyledSelect
            grow={true}
            selected={requestMethod}
            options={{GET: 'GET', POST: 'POST'}}
            onChange={(text: string) =>
              networkRouteManager.modifyRoute(id, {requestMethod: text})
            }
          />
        </StyledSelectContainer>
        <StyledInput
          type="text"
          placeholder="URL"
          value={requestUrl}
          onChange={(event) =>
            networkRouteManager.modifyRoute(id, {
              requestUrl: event.target.value,
            })
          }
        />
      </FlexRow>
      <FlexRow style={{width: '20%'}}>
        <StyledInput
          type="text"
          placeholder="STATUS"
          value={responseStatus}
          onChange={(event) =>
            networkRouteManager.modifyRoute(id, {
              responseStatus: event.target.value,
            })
          }
        />
      </FlexRow>
      {isDuplicated && (
        <Warning>
          <Glyph name="caution-triangle" color={colors.yellow} />
          <Text style={{marginLeft: 5}}>
            Route is duplicated (Same URL and Method)
          </Text>
        </Warning>
      )}
      <StyledText />
      <Tabs
        active={activeTab}
        onActive={(newActiveTab) => {
          if (newActiveTab != null) {
            setActiveTab(newActiveTab);
          }
        }}>
        <Tab key={'data'} label={'Data'}>
          <textarea
            style={textAreaStyle}
            wrap="soft"
            autoComplete="off"
            spellCheck={false}
            value={formattedResponse}
            onChange={(event) =>
              networkRouteManager.modifyRoute(id, {
                responseData: event.target.value,
              })
            }
          />
        </Tab>
        <Tab key={'headers'} label={'Headers'}>
          <Layout.Container style={{width: '100%'}}>
            <Layout.Horizontal>
              <Button
                onClick={() => {
                  const newHeaders = {
                    ...route.responseHeaders,
                    [nextHeaderId.toString()]: {key: '', value: ''},
                  };
                  setNextHeaderId(nextHeaderId + 1);
                  networkRouteManager.modifyRoute(id, {
                    responseHeaders: newHeaders,
                  });
                }}
                compact
                padded
                style={{marginBottom: 10}}>
                Add Header
              </Button>
            </Layout.Horizontal>
            <Layout.ScrollContainer>
              <ManagedTable
                hideHeader={true}
                multiline={true}
                columnSizes={HeadersColumnSizes}
                columns={HeadersColumns}
                rows={_buildMockResponseHeaderRows(
                  id,
                  route,
                  selectedHeaderIds.length === 1 ? selectedHeaderIds[0] : null,
                  networkRouteManager,
                )}
                stickyBottom={true}
                autoHeight={true}
                floating={false}
                zebra={false}
                onRowHighlighted={setSelectedHeaderIds}
                highlightedRows={new Set(selectedHeaderIds)}
              />
            </Layout.ScrollContainer>
          </Layout.Container>
        </Tab>
      </Tabs>
    </Container>
  );
}
