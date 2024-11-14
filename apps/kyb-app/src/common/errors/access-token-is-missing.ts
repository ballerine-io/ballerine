export class AccessTokenIsMissingError extends Error {
  constructor() {
    super('Access token is missing');
  }
}
