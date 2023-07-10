import { forwardRef, Module } from '@nestjs/common';
import { UserControllerInternal } from './user.controller.internal';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

// eslint-disable-next-line import/no-cycle
import { AuthModule } from '../auth/auth.module';
import { ACLModule } from '@/common/access-control/acl.module';

@Module({
  imports: [ACLModule, forwardRef(() => AuthModule)],
  controllers: [UserControllerInternal],
  providers: [UserRepository, UserService],
  exports: [ACLModule, AuthModule, UserService],
})
export class UserModule {}
