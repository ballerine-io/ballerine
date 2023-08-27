import { Module } from '@nestjs/common';
import { ACLModule } from '@/common/access-control/acl.module';
import { CustomerControllerInternal } from '@/customer/customer.controller.internal';
import { CustomerRepository } from '@/customer/customer.repository';
import { CustomerService } from '@/customer/customer.service';
import { CustomerControllerExternal } from '@/customer/customer.controller.external';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [ACLModule, PrismaModule],
  controllers: [CustomerControllerInternal, CustomerControllerExternal],
  providers: [CustomerService, CustomerRepository],
  exports: [ACLModule, CustomerService],
})
export class CustomerModule {}
