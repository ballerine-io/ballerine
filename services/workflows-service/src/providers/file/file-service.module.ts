import { Module } from '@nestjs/common';
import { FileService } from '@/providers/file/file.service';
import { WorkflowControllerExternal } from '@/workflow/workflow.controller.external';
import { initHttpModule } from '@/common/http-service/http-config.service';

@Module({
  imports: [initHttpModule()],
  controllers: [WorkflowControllerExternal],
  providers: [FileService],
  exports: [FileService],
})
export class FileServiceModule {}
