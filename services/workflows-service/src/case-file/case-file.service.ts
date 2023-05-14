import { Injectable } from '@nestjs/common';
import { CreateCaseFileDto } from './dto/create-case-file.dto';
import { UpdateCaseFileDto } from './dto/update-case-file.dto';

@Injectable()
export class CaseFileService {
  create(createCaseFileDto: CreateCaseFileDto) {
    return 'This action adds a new caseFile';
  }

  findAll() {
    return `This action returns all caseFile`;
  }

  findOne(id: number) {
    return `This action returns a #${id} caseFile`;
  }

  update(id: number, updateCaseFileDto: UpdateCaseFileDto) {
    return `This action updates a #${id} caseFile`;
  }

  remove(id: number) {
    return `This action removes a #${id} caseFile`;
  }
}
