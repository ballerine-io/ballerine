import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BasicStrategy } from './basic/basic.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';
import { PasswordService } from './password/password.service';
// eslint-disable-next-line import/no-cycle
import { UserModule } from '../user/user.module';
import { LocalStrategy } from '@/auth/local/local.strategy';
import { SessionSerializer } from '@/auth/session-serializer';
import { UserService } from '@/user/user.service';
import { UserRepository } from '@/user/user.repository';
import { PassportModule } from '@nestjs/passport';
import { env } from '@/env';
import { ProjectModule } from '@/project/project.module';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { WorkflowTokenRepository } from '@/auth/workflow-token/workflow-token.repository';
import { JwtAuthService } from './jwt/jwt.service';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({
      session: true,
      defaultStrategy: 'local',
    }),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: env.JWT_SECRET_KEY,
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
    ProjectModule,
  ],
  providers: [
    AuthService,
    PasswordService,
    UserRepository,
    {
      provide: 'USER_SERVICE',
      useClass: UserService,
    },
    BasicStrategy,
    JwtStrategy,
    LocalStrategy,
    SessionSerializer,
    JwtAuthService,
  ],
  controllers: [AuthController],
  exports: [AuthService, PasswordService, PassportModule],
})
export class AuthModule {}
