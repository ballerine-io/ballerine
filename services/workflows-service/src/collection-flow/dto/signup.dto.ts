import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ required: true, type: String })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  firstName!: string;

  @ApiProperty({ required: true, type: String })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  lastName!: string;

  @ApiProperty({ required: true, type: String })
  @IsEmail()
  @IsNotEmpty()
  @MinLength(1)
  email!: string;
}
