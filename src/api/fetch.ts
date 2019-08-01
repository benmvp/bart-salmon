export const fetchJson = (
  url: string,
  options?: RequestInit,
) => fetch(url, options).then(resp => resp.json())
