import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  username!: string;
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  password!: string;
}
