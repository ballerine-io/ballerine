import { forwardRef, Module } from '@nestjs/common';
import { UserControllerInternal } from './user.controller.internal';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

// eslint-disable-next-line import/no-cycle
import { AuthModule } from '../auth/auth.module';
import { ACLModule } from '@/common/access-control/acl.module';
import { ProjectModule } from '@/project/project.module';
import { WebhookService } from '@/webhooks/webhook.service';

@Module({
  imports: [ACLModule, forwardRef(() => AuthModule), ProjectModule],
  controllers: [UserControllerInternal],
  providers: [UserRepository, UserService, WebhookService],
  exports: [ACLModule, AuthModule, UserService],
})
export class UserModule {}
