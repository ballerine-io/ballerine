export class ServerNotAvailableError extends Error {
  constructor() {
    super('Server not available');
  }
}
