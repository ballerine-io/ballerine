import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class EndUserUpdateDto {
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
  @ApiProperty({
    type: String,
  })
  @IsString()
  email?: string;

  @IsOptional()
  @ApiProperty({
    type: Boolean,
  })
  @IsBoolean()
  isContactPerson?: boolean;

  @IsOptional()
  @ApiProperty({
    type: String,
  })
  @IsString()
  phone?: string;

  @IsOptional()
  @ApiProperty({
    type: String,
  })
  @IsString()
  dateOfBirth?: string;

  @IsOptional()
  @ApiProperty({
    type: String,
  })
  @IsString()
  avatarUrl?: string;
}
