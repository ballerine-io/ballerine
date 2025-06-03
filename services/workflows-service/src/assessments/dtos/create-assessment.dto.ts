import { oneOf } from '@/common/decorators/one-of.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAssessmentDto {
  @ApiProperty({
    description: 'Type of assessment',
    example: 'kyb_and_ownership',
  })
  @oneOf(['kyb_and_ownership'])
  type!: 'kyb_and_ownership';

  @ApiProperty({
    description: 'Business ID',
    example: '1234567890',
  })
  @IsString()
  @IsOptional()
  @MinLength(1)
  businessId?: string;

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
    example: 'US',
  })
  @IsString()
  country!: string;

  @ApiPropertyOptional({
    description: 'State where the company is registered (if applicable)',
    example: 'CA',
  })
  @IsString()
  @IsOptional()
  state?: string;
}
