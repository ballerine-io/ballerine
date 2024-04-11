import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetBusinessReportsDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  businessId!: string;
}
