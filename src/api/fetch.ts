export const fetchJson = (
  url: string,
  options?: RequestInit,
) => fetch(url, options)
  .then((resp) => {
    if (resp.status >= 300) {
      throw new Error(`Request for ${url} failed with status: ${resp.status} (${resp.statusText})`)
    }

    return resp.json()
  })
