import { Global, Module } from '@nestjs/common';
import {RequestProjectContext} from "@/common/utils/project-context/request-project-context";

@Global()
@Module({
  exports: [RequestProjectContext],
  providers: [RequestProjectContext],
})
export class ProjectContextModule {}
