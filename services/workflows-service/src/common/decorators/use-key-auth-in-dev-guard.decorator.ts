import { env } from '@/env';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';

export const UseKeyAuthInDevGuard = () => {
  if (['development', 'local'].includes(env.ENVIRONMENT_NAME)) {
    return () => {
      return;
    };
  }

  return UseCustomerAuthGuard();
};
