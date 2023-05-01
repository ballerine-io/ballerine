import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JWT_EXPIRATION } from '../env';
import { SecretsManagerModule } from '../providers/secrets/secrets-manager.module';
import { SecretsManagerService } from '../providers/secrets/secrets-manager.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BasicStrategy } from './basic/basic.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';
import { jwtSecretFactory } from './jwt/jwt-secret-factory';
import { PasswordService } from './password/password.service';
import { TokenService } from './token/token.service';
import { INJECTION_TOKEN_JWT_SECRET_KEY } from '@/injection-tokens';

// eslint-disable-next-line import/no-cycle
import { UserModule } from '../user/user.module';
import { LocalStrategy } from '@/auth/local/local.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule,
    SecretsManagerModule,
    JwtModule.registerAsync({
      imports: [SecretsManagerModule],
      inject: [SecretsManagerService, ConfigService],
      useFactory: async (secretsService: SecretsManagerService, configService: ConfigService) => {
        const secret = await secretsService.getSecret<string>(INJECTION_TOKEN_JWT_SECRET_KEY);
        const expiresIn = configService.get<string>(JWT_EXPIRATION);
        if (!secret) {
          throw new Error("Didn't get a valid jwt secret");
        }
        if (!expiresIn) {
          throw new Error('Jwt expire in value is not valid');
        }
        return {
          secret: secret,
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    BasicStrategy,
    PasswordService,
    JwtStrategy,
    jwtSecretFactory,
    TokenService,
  ],
  controllers: [AuthController],
  exports: [AuthService, PasswordService],
})
export class AuthModule {}
