import { Module } from '@nestjs/common';
import { ACLModule } from '@/common/access-control/acl.module';
import { TransactionControllerInternal } from '@/transaction/transaction.controller.internal';
import { TransactionRepository } from '@/transaction/transaction.repository';
import { TransactionService } from '@/transaction/transaction.service';
import { TransactionControllerExternal } from '@/transaction/transaction.controller.external';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProjectScopeService } from '@/project/project-scope.service';

@Module({
  imports: [ACLModule, PrismaModule],
  controllers: [TransactionControllerInternal, TransactionControllerExternal],
  providers: [TransactionService, TransactionRepository, ProjectScopeService],
  exports: [ACLModule, TransactionService],
})
export class TransactionModule {}
