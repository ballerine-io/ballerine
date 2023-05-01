import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';
import { InputJsonValue } from '../../types';

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
  password!: string;

  @ApiProperty({
    required: true,
  })
  @IsArray()
  @IsString({ each: true })
  roles!: InputJsonValue;

  // @ApiProperty({
  //   required: false,
  //   type: () => WorkflowCreateNestedManyWithoutUsersInput,
  // })
  // @ValidateNested()
  // @Type(() => WorkflowCreateNestedManyWithoutUsersInput)
  // @IsOptional()
  // workflows?: WorkflowCreateNestedManyWithoutUsersInput;
}
