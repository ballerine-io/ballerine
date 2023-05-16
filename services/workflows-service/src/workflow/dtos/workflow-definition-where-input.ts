import { ApiProperty } from '@nestjs/swagger';
import { StringNullableFilter } from '@/common/query-filters/string-nullable-filter';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { StringFilter } from '@/common/query-filters/string-filter';
import { UserWhereUniqueInput } from '@/user/dtos/user-where-unique-input';
import { DateTimeFilter } from '@/common/query-filters/date-time-filter';

export class WorkflowDefinitionWhereInput {
  @ApiProperty({
    required: false,
    type: () => UserWhereUniqueInput,
  })
  @ValidateNested()
  @Type(() => UserWhereUniqueInput)
  @IsOptional()
  user?: UserWhereUniqueInput;

  @ApiProperty({
    required: false,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  @IsOptional()
  id?: StringFilter;

  @ApiProperty({
    required: false,
    type: StringFilter,
  })
  @Type(() => StringFilter)
  @IsOptional()
  name?: StringFilter;

  @ApiProperty({
    required: false,
    type: StringNullableFilter,
  })
  @Type(() => StringNullableFilter)
  @IsOptional()
  workflowDefinitionType?: string;

  @ApiProperty({
    required: false,
    type: StringNullableFilter,
  })
  @IsOptional()
  state?: StringNullableFilter;

  @ApiProperty({
    required: false,
    type: DateTimeFilter,
  })
  @Type(() => DateTimeFilter)
  createdAt?: DateTimeFilter;

  @ApiProperty({
    required: false,
    type: DateTimeFilter,
  })
  @Type(() => DateTimeFilter)
  updatedAt?: DateTimeFilter;
}
