import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString } from 'class-validator';

export class DocumentUpdateInput {
  @ApiProperty({
    required: true,
    type: Object,
  })
  @IsObject()
  document!: any;

  @ApiProperty({
    required: false,
    type: String,
  })
  @IsOptional()
  @IsString()
  directorId?: string;
}
