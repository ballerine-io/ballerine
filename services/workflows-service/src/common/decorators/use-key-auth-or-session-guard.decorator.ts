import { applyDecorators, UseGuards } from '@nestjs/common';
import { CustomerAuthGuard } from '@/common/guards/customer-auth.guard';

export const UseKeyAuthOrSessionGuard = () => applyDecorators(UseGuards(CustomerAuthGuard));
