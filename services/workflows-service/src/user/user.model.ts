import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString, IsArray, IsOptional } from 'class-validator';
import { Exclude, Type } from 'class-transformer';
import { JsonValue } from 'type-fest';

export class UserModel {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  id!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  email!: string;

  @ApiProperty()
  @IsString()
  firstName!: string;

  @ApiProperty()
  @IsString()
  lastName!: string;

  @Exclude()
  password!: string;

  @ApiProperty({
    required: true,
  })
  @IsArray()
  @IsString({ each: true })
  roles!: JsonValue;

  @ApiProperty({
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  updatedAt!: Date;

  @ApiProperty({
    required: true,
  })
  @IsDate()
  @Type(() => Date)
  createdAt!: Date;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  lastActiveAt!: Date | null;
}
