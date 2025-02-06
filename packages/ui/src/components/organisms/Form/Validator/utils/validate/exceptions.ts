export class AbortAfterFirstErrorException extends Error {
  constructor() {
    super('Abort after first error');
  }
}
