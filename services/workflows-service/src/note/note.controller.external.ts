import type { Request } from 'express';
import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { Param, Req } from '@nestjs/common';

import { NoteModel } from '@/note/note.model';
import { NoteService } from '@/note/note.service';
import { CreateNoteDto } from './dtos/create-note.dto';
import type { AuthenticatedEntity, TProjectId } from '@/types';
import { GetByNoteableDto } from '@/note/dtos/get-by-noteable.dto';
import { CurrentProject } from '@/common/decorators/current-project.decorator';

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

  @common.Get('/:noteableType/:noteableId')
  @swagger.ApiForbiddenResponse()
  @swagger.ApiOkResponse({ type: Array<NoteModel> })
  async getByNoteable(
    @Param('noteableType') noteableType: GetByNoteableDto['noteableType'],
    @Param('noteableId') noteableId: GetByNoteableDto['noteableId'],
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    return this.noteService.list(currentProjectId, {
      where: {
        noteableId,
        noteableType,
      },
    });
  }

  @common.Post()
  @swagger.ApiForbiddenResponse()
  @swagger.ApiCreatedResponse({ type: NoteModel })
  async create(
    @Req() req: Request,
    @common.Body() note: CreateNoteDto,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    const { user } = req.user as unknown as AuthenticatedEntity;

    return this.noteService.create({ ...note, createdBy: user?.id }, currentProjectId);
  }
}
