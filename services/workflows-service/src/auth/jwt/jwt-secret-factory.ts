import { INJECTION_TOKEN_JWT_SECRET_KEY } from '@/injection-tokens';
import { SecretsManagerService } from '../../providers/secrets/secrets-manager.service';

export const jwtSecretFactory = {
  provide: INJECTION_TOKEN_JWT_SECRET_KEY,
  useFactory: async (secretsService: SecretsManagerService): Promise<string> => {
    const secret = await secretsService.fetchSecret<string>(INJECTION_TOKEN_JWT_SECRET_KEY);

    if (secret) {
      return secret;
    }
    throw new Error('jwtSecretFactory missing secret');
  },
  inject: [SecretsManagerService],
};
