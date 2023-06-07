import { ApiProperty } from '@nestjs/swagger';
import { EndUserQueryDto } from '@/end-user/dtos/end-user-filter-query';

export class EndUserFilterCreateDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  name!: string;

  @ApiProperty({
    required: true,
    type: () => EndUserQueryDto,
  })
  query!: EndUserQueryDto;
}
