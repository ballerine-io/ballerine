import { Module } from '@nestjs/common';
import { FileService } from '@/providers/file/file.service';
import { WorkflowControllerExternal } from '@/workflow/workflow.controller.external';

@Module({
  controllers: [WorkflowControllerExternal],
  providers: [FileService],
  exports: [FileService],
})
export class FileServiceModule {}
