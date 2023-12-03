import { oneOf } from '@/common/decorators/one-of.decorator';
import { IsOptional, IsString } from 'class-validator';

export class DocumentUpdateQueryInput {
  @IsString()
  @IsOptional()
  @oneOf(['base', 'director'])
  contextUpdateMethod!: 'base' | 'director';
}
