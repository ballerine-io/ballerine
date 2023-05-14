import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CaseFileService } from './case-file.service';
import { CreateCaseFileDto } from './dto/create-case-file.dto';
import { UpdateCaseFileDto } from './dto/update-case-file.dto';

@Controller('case-file')
export class CaseFileController {
  constructor(private readonly caseFileService: CaseFileService) {}

  @Post()
  create(@Body() createCaseFileDto: CreateCaseFileDto) {
    return this.caseFileService.create(createCaseFileDto);
  }

  @Get()
  findAll() {
    return this.caseFileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.caseFileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCaseFileDto: UpdateCaseFileDto) {
    return this.caseFileService.update(+id, updateCaseFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.caseFileService.remove(+id);
  }
}
