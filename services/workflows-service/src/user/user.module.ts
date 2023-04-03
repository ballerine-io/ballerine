import { Module, forwardRef } from '@nestjs/common';
import { MorganModule } from 'nest-morgan';
import { ACLModule } from '../access-control/acl.module';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

// eslint-disable-next-line import/no-cycle
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ACLModule, forwardRef(() => AuthModule), MorganModule],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [ACLModule, AuthModule, MorganModule, UserService],
})
export class UserModule {}
