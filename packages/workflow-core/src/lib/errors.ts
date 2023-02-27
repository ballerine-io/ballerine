export class HttpError extends Error {
  constructor(public status: number, message: string, cause?: unknown) {
    super(message, {cause});
  }
}
