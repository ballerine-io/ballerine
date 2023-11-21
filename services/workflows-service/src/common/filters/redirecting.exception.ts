import { UnauthorizedException } from '@nestjs/common';

export default class RedirectingException extends UnauthorizedException {
  constructor(public readonly url: string, public readonly message: string) {
    super(message);
  }
}
