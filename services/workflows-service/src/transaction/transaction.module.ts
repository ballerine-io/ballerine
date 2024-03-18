import { Module } from '@nestjs/common';
import { ACLModule } from '@/common/access-control/acl.module';
import { TransactionControllerInternal } from '@/transaction/transaction.controller.internal';
import { TransactionRepository } from '@/transaction/transaction.repository';
import { TransactionService } from '@/transaction/transaction.service';
import { TransactionControllerExternal } from '@/transaction/transaction.controller.external';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProjectScopeService } from '@/project/project-scope.service';
import { SentryService } from '@/sentry/sentry.service';
import { TransactionFactory } from '@/transaction/test-utils/transaction-factory';

@Module({
  imports: [ACLModule, PrismaModule],
  controllers: [TransactionControllerInternal, TransactionControllerExternal],
  providers: [
    TransactionService,
    TransactionRepository,
    ProjectScopeService,
    SentryService,
    TransactionFactory,
  ],
  exports: [ACLModule, TransactionService, TransactionFactory],
})
export class TransactionModule {}
