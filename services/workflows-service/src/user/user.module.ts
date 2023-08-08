import { forwardRef, Module } from '@nestjs/common';
import { UserControllerInternal } from './user.controller.internal';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

// eslint-disable-next-line import/no-cycle
import { AuthModule } from '../auth/auth.module';
import { ACLModule } from '@/common/access-control/acl.module';
import {ProjectContextModule} from "@/common/utils/project-context/project-context-module";
import {HttpModule} from "@nestjs/axios";

@Module({
  imports: [ACLModule, forwardRef(() => AuthModule), ProjectContextModule, HttpModule],
  controllers: [UserControllerInternal],
  providers: [UserRepository, UserService],
  exports: [ACLModule, AuthModule, UserService],
})
export class UserModule {}
