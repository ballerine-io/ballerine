import { Module } from '@nestjs/common';
import { FileService } from '@/providers/file/file.service';

@Module({
  providers: [FileService],
  exports: [FileService],
})
export class FileServiceModule {}
