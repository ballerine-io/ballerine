import { Module } from '@nestjs/common';
import { EndUserControllerInternal } from './end-user.controller.internal';
import { EndUserRepository } from './end-user.repository';
import { EndUserService } from './end-user.service';

@Module({
  controllers: [EndUserControllerInternal],
  providers: [
    EndUserRepository,
    EndUserService,
  ],
})
export class EndUserModule {}
