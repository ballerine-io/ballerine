import { Module } from '@nestjs/common';
import { FileService } from '@/providers/file/file.service';
import { WorkflowControllerExternal } from '@/workflow/workflow.controller.external';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule, // TODO: register with config and set retry mechanisem for http calls
  ],
  controllers: [WorkflowControllerExternal],
  providers: [FileService],
  exports: [FileService],
})
export class FileServiceModule {}
