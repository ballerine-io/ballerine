import { applyDecorators, UseGuards } from '@nestjs/common';
import { KeyAuthGuard } from '@/auth/key-auth.guard';

export const UseKeyAuthOrSessionGuard = () => applyDecorators(UseGuards(KeyAuthGuard));
