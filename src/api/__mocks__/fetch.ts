let MOCK_RESP_TEXT: string

export const __setMockText = (mockRespText: string): void => {
  MOCK_RESP_TEXT = mockRespText
}

export const fetchText = (): Promise<string> =>
  new Promise((resolve) => {
    setTimeout(resolve.bind(null, MOCK_RESP_TEXT), 0)
  })
