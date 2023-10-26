import { env } from '@/env';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';

export const UseKeyAuthInDevGuard = () => {
  if (env.NODE_ENV !== 'development' && env.NODE_ENV !== 'local') {
    return () => {
      return;
    };
  }

  return UseCustomerAuthGuard();
};
