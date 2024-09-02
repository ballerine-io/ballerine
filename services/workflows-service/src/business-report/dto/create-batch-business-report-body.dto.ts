import { ApiProperty } from '@nestjs/swagger';

export class CreateBatchBusinessReportBodyDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'CSV file for batch business report',
  })
  file!: Express.Multer.File;
}
