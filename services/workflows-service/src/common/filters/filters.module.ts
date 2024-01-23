import { AllExceptionsFilter } from '@/common/filters/AllExceptions.filter';
import { HttpExceptionFilter } from '@/common/filters/HttpExceptions.filter';
import { PrismaClientValidationFilter } from '@/common/filters/prisma-client-validation-filter/PrismaClientValidation.filter';
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { SessionExpiredExceptionFilter } from './session-exception.filter';

@Module({
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: SessionExpiredExceptionFilter },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_FILTER, useClass: PrismaClientValidationFilter },
  ],
})
export class FiltersModule {}
