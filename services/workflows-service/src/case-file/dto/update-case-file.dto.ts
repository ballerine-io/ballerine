import { PartialType } from '@nestjs/swagger';
import { CreateCaseFileDto } from './create-case-file.dto';

export class UpdateCaseFileDto extends PartialType(CreateCaseFileDto) {}
