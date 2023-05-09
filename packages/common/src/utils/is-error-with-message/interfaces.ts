export interface IErrorWithMessage extends Error {
  message: string;
}

export interface IErrorWithName extends Error {
  name: string;
}
