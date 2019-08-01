let MOCK_RESP_JSON: {}

export const __setMockJson = (mockRespJson: {}): void => {
  MOCK_RESP_JSON = mockRespJson
}

export const fetchJson = (): Promise<{}> =>
  new Promise((resolve) => {
    setTimeout(resolve.bind(null, MOCK_RESP_JSON), 0)
  })
