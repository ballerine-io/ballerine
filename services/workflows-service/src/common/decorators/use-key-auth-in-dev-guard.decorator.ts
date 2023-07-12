import { UseKeyAuthGuard } from '@/common/decorators/use-key-auth-guard.decorator';
import { env } from '@/env';

export const UseKeyAuthInDevGuard = () => {
  if (env.NODE_ENV !== 'development' && env.NODE_ENV !== 'local') {
    return () => {
      return;
    };
  }

  return UseKeyAuthGuard();
};
