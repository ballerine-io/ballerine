import { Module } from '@nestjs/common';
import { ACLModule } from '@/common/access-control/acl.module';
import { CustomerControllerInternal } from '@/customer/customer.controller.internal';
import { CustomerRepository } from '@/customer/customer.repository';
import { CustomerService } from '@/customer/customer.service';

@Module({
  imports: [ACLModule],
  controllers: [CustomerControllerInternal],
  providers: [CustomerService, CustomerRepository],
  exports: [ACLModule, CustomerService],
})
export class CustomerModule {}
