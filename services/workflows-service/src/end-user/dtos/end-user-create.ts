import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class EndUserCreateDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  firstName!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  lastName!: string;

  @IsOptional()
  email!: string;

  @IsOptional()
  phone!: string;

  @IsOptional()
  companyName!: string;
}
