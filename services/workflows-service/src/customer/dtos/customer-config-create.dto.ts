import { ApiProperty } from '@nestjs/swagger';
import { CustomerSubscriptionSchema, type TCustomerSubscription } from '../schemas/zod-schemas';

class Subscription {
  type!: string;
  url!: string;
  events!: string[];
}
export class CustomerSubscriptionDto {
  @ApiProperty({
    required: true,
    type: () => Subscription,
  })
  subscriptions!: TCustomerSubscription;
}
