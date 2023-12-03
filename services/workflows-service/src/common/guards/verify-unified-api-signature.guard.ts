import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';
import { env } from '@/env';
import { verifySignature } from '../utils/verify-signature';

@Injectable()
export class VerifyUnifiedApiSignatureGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    const signature = request.headers['x-hmac-signature'] ?? '';

    if (typeof signature !== 'string') {
      throw new UnauthorizedException('Invalid signature');
    }

    if (
      !verifySignature({
        payload: request.body,
        signature,
        key: env.UNIFIED_API_SHARED_SECRET ?? '',
      })
    ) {
      throw new UnauthorizedException('Invalid signature');
    }

    return true;
  }
}
