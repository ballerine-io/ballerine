import { Module } from '@nestjs/common';
import { ACLModule } from '@/common/access-control/acl.module';
import { CustomerControllerInternal } from '@/customer/customer.controller.internal';
import { CustomerRepository } from '@/customer/customer.repository';
import { CustomerService } from '@/customer/customer.service';
import {CustomerControllerExternal} from "@/customer/customer.controller.external";

@Module({
  imports: [ACLModule],
  controllers: [CustomerControllerInternal, CustomerControllerExternal],
  providers: [CustomerService, CustomerRepository],
  exports: [ACLModule, CustomerService],
})
export class CustomerModule {}
