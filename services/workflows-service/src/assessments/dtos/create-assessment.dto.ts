import { oneOf } from '@/common/decorators/one-of.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateAssessmentDto {
  @ApiProperty({
    description: 'Type of assessment',
    example: 'kyb_and_ownership',
  })
  @IsString()
  @oneOf(['kyb_and_ownership'])
  type!: 'kyb_and_ownership';

  @ApiProperty({
    description: 'Registration number of the company',
    example: 'REG123456',
  })
  @IsString()
  registrationNumber!: string;

  @ApiProperty({
    description: 'Name of the company',
    example: 'Acme Corporation',
  })
  @IsString()
  companyName!: string;

  @ApiProperty({
    description: 'Country where the company is registered',
    example: 'United States',
  })
  @IsString()
  country!: string;

  @ApiPropertyOptional({
    description: 'State where the company is registered (if applicable)',
    example: 'California',
  })
  @IsString()
  @IsOptional()
  state!: string;
}
