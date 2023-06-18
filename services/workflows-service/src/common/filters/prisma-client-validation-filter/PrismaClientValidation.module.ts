import { PrismaClientValidationFilter } from '@/common/filters/prisma-client-validation-filter/PrismaClientValidation.filter';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [{ provide: APP_FILTER, useClass: PrismaClientValidationFilter }],
})
export class PrismaClientValidationModule {}
