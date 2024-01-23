import { Module } from '@nestjs/common';
import { FileService } from '@/providers/file/file.service';
import { WorkflowControllerExternal } from '@/workflow/workflow.controller.external';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [WorkflowControllerExternal],
  providers: [FileService],
  exports: [FileService],
})
export class FileServiceModule {}
