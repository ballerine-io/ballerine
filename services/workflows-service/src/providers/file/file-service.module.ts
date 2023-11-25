import { Module } from '@nestjs/common';
import { FileService } from '@/providers/file/file.service';
import { WorkflowControllerExternal } from '@/workflow/workflow.controller.external';
import { initHttpMoudle } from '@/common/http-service/http-config.service';

@Module({
  imports: [initHttpMoudle()],
  controllers: [WorkflowControllerExternal],
  providers: [FileService],
  exports: [FileService],
})
export class FileServiceModule {}
