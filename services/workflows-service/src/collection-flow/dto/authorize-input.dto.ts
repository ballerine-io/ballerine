import { IsEmail } from 'class-validator';

export class AuthorizeDto {
  @IsEmail()
  email!: string;
}
