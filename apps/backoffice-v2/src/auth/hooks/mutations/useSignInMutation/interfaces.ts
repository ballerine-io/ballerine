export interface ISignInProps {
  redirect?: boolean;
  callbackUrl?: string;
  body?: {
    [key: string]: unknown;
  };
}
