export interface ITokenPayload {
  id: string;
  email: string;
  password: string;
}

export interface ITokenService {
  createToken: ({ id, email, password }: ITokenPayload) => Promise<string>;
}
