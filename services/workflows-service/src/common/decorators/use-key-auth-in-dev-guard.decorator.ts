import { env } from '@/env';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';

export const UseKeyAuthInDevGuard = () => {
  if (env.ENVIRONMENT_NAME !== 'development' && env.ENVIRONMENT_NAME !== 'local') {
    return () => {
      return;
    };
  }

  return UseCustomerAuthGuard();
};
