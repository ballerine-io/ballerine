import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthorizeDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  flowType!: string;
}
