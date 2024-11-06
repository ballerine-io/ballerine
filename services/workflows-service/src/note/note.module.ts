import { Module } from '@nestjs/common';
import { PrismaModule } from '@/prisma/prisma.module';

import { NoteService } from '@/note/note.service';
import { NoteRepository } from '@/note/note.repository';
import { NoteControllerExternal } from '@/note/note.controller.external';

@Module({
  imports: [PrismaModule],
  controllers: [NoteControllerExternal],
  providers: [NoteService, NoteRepository],
  exports: [NoteService, NoteRepository],
})
export class NoteModule {}
