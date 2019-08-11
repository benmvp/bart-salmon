let MOCK_RESP_JSON_STRING = ''

export const __setMockJson = (mockRespJsonString: string): void => {
  MOCK_RESP_JSON_STRING = mockRespJsonString
}

export const fetchJson = (): Promise<{}> =>
  new Promise((resolve) => {
    setTimeout(resolve.bind(null, JSON.parse(MOCK_RESP_JSON_STRING)), 0)
  })
