import { IsDate, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BusinessPatchDto } from './business.patch.dto';
import { Type } from 'class-transformer';

export class BusinessDto extends BusinessPatchDto {
  @ApiProperty({ type: String, required: true })
  @IsString()
  id!: string;

  @ApiProperty({
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty({
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  updatedAt!: Date;

  @ApiProperty({ type: String, required: true })
  @IsString()
  projectId!: string;
}
