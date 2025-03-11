import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BasicStrategy } from './basic/basic.strategy';
import { PasswordService } from './password/password.service';
// eslint-disable-next-line import/no-cycle
import { UserModule } from '../user/user.module';
import { LocalStrategy } from '@/auth/local/local.strategy';
import { SessionSerializer } from '@/auth/session-serializer';
import { UserService } from '@/user/user.service';
import { UserRepository } from '@/user/user.repository';
import { PassportModule } from '@nestjs/passport';
import { ProjectModule } from '@/project/project.module';
import { MagicLinkStrategy } from '@/auth/magic-link/magic-link.strategy';
import { CustomerService } from '@/customer/customer.service';
import { CustomerRepository } from '@/customer/customer.repository';
import { ApiKeyService } from '@/customer/api-key/api-key.service';
import { MerchantMonitoringClient } from '@/merchant-monitoring/merchant-monitoring.client';
import { ApiKeyRepository } from '@/customer/api-key/api-key.repository';

@Module({
  imports: [
    forwardRef(() => UserModule),
    PassportModule.register({
      session: true,
      defaultStrategy: 'local',
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
    MagicLinkStrategy,
    BasicStrategy,
    LocalStrategy,
    SessionSerializer,
    CustomerService,
    CustomerRepository,
    ApiKeyService,
    ApiKeyRepository,
    MerchantMonitoringClient,
  ],
  controllers: [AuthController],
  exports: [AuthService, PasswordService, PassportModule],
})
export class AuthModule {}
