import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { env } from '@/env';
import { verifySignature } from '../utils/verify-signature';

@Injectable()
export class VerifyUnifiedApiSignatureGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const sharedSecret = env.UNIFIED_API_SHARED_SECRET;

    if (!sharedSecret) {
      throw new InternalServerErrorException('UNIFIED_API_SHARED_SECRET is not configured.');
    }

    const signature = request.headers['x-hmac-signature'] ?? '';

    if (typeof signature !== 'string') {
      throw new UnauthorizedException('Invalid signature');
    }

    if (
      !verifySignature({
        payload: request.body,
        key: sharedSecret,
        signature,
      })
    ) {
      throw new UnauthorizedException('Invalid signature');
    }

    return true;
  }
}
