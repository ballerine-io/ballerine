import { ReportsController } from '@/reports/reports.controller';
import { Module } from '@nestjs/common';

@Module({ controllers: [ReportsController] })
export class ReportsModule {}
