import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';

import type { TProjectId } from '@/types';
import { NoteModel } from '@/note/note.model';
import { NoteService } from '@/note/note.service';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { CreateNoteDto } from './dtos/create-note.dto';

@swagger.ApiTags('Notes')
@swagger.ApiBearerAuth()
@common.Controller('external/notes')
export class NoteControllerExternal {
  constructor(protected readonly noteService: NoteService) {}

  @common.Get()
  @swagger.ApiForbiddenResponse()
  @swagger.ApiOkResponse({ type: Array<NoteModel> })
  async list(@CurrentProject() currentProjectId: TProjectId) {
    return this.noteService.list(currentProjectId);
  }

  @common.Post()
  @swagger.ApiForbiddenResponse()
  @swagger.ApiCreatedResponse({ type: NoteModel })
  async create(@common.Body() note: CreateNoteDto, @CurrentProject() currentProjectId: TProjectId) {
    return this.noteService.create(note, currentProjectId);
  }
}
