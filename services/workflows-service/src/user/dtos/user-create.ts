import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';
import type { InputJsonValue } from '../../types';

export class UserCreateDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  email!: string;

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

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  password!: string;

  @ApiProperty({
    required: true,
  })
  @IsArray()
  @IsString({ each: true })
  roles!: InputJsonValue;

  @ApiProperty({
    required: true,
    type: Array,
  })
  @IsArray()
  @IsString({ each: true })
  projectIds!: string[];
  // @ApiProperty({
  //   required: false,
  //   type: () => WorkflowCreateNestedManyWithoutUsersInput,
  // })
  // @ValidateNested()
  // @Type(() => WorkflowCreateNestedManyWithoutUsersInput)
  // @IsOptional()
  // workflows?: WorkflowCreateNestedManyWithoutUsersInput;
}
