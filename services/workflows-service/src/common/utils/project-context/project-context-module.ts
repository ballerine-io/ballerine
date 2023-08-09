import { Global, Module } from '@nestjs/common';
import {RequestProjectService} from "@/common/utils/project-context/request-project-service";

@Global()
@Module({
  exports: [RequestProjectService],
  providers: [RequestProjectService],
})
export class ProjectContextModule {}
