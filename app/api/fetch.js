// @flow

export const fetchText = (url: string, options: ?Object = undefined): Promise<string> => (
    fetch(url, options)
        .then((resp) => resp.text())
)
