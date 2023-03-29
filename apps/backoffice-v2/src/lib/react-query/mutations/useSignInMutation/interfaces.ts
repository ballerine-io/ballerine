import { endpoints } from '@/api/endpoints';

export interface ISignInProps {
  redirect?: boolean;
  callbackUrl?: string;
  provider?: keyof (typeof endpoints)['auth']['signIn'];
}
