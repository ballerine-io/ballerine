const urlPattern =
  '((https?):\\/\\/)?([a-zA-Z0-9-_]+\\.)+[a-zA-Z0-9]+(\\.[a-z]{2})?(\\/[a-zA-Z0-9_#-]+)*(\\/)?(\\?[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+(&[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+)*)?(#[a-zA-Z0-9_-]+)?';

export const singleUrlPattern = `^${urlPattern}$`;

export const multipleUrlsPattern = `^${urlPattern}(, *${urlPattern})*$`;
