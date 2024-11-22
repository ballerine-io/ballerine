export class InvalidAccessTokenError extends Error {
  constructor() {
    super('Invalid access token');
  }
}
