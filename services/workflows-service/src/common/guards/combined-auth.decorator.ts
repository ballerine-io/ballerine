import { applyDecorators, UseGuards } from '@nestjs/common';
import { CombinedAuthGuard } from './combined-auth.guard';

export const UseCombinedAuthGuard = () => applyDecorators(UseGuards(CombinedAuthGuard));
