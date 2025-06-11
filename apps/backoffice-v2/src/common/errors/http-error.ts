export class HttpError extends Error {
  constructor(
    public code: number,
    public message: string,
    public errors?: Array<{ message: string; path?: string }>,
  ) {
    super(message);
  }
}
