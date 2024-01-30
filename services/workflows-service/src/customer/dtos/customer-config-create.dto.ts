import { ApiProperty } from '@nestjs/swagger';
import type { TCustomerSubscription } from '../schemas/zod-schemas';

export class CustomerConfigCreateDto {
  @ApiProperty({
    required: true,
    type: Object,
  })
  subscriptions!: TCustomerSubscription;
}
