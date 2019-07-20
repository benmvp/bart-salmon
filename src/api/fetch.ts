export const fetchText = (
  url: string,
  options?: RequestInit,
): Promise<string> => fetch(url, options).then(resp => resp.text())
