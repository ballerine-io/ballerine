import { Module } from '@nestjs/common';
import { ProjectScopeService } from '@/project/project-scope.service';

@Module({
  controllers: [],
  providers: [ProjectScopeService],
  exports: [ProjectScopeService],
})
export class ProjectModule {}
