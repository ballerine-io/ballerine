import { KeyAuthGuard } from '@/common/guards/key-auth.guard';
import { applyDecorators, UseGuards } from '@nestjs/common';

export const UseKeyAuthOrSessionGuard = () => applyDecorators(UseGuards(KeyAuthGuard));
