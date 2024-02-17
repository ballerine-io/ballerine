import { ApiProperty } from '@nestjs/swagger';
import { type TCustomerSubscription } from '../schemas/zod-schemas';
import { Subscription } from '../customer.model';

export class CustomerSubscriptionDto {
  @ApiProperty({
    type: Subscription,
    example: [
      {
        url: 'http://site',
        events: ['hook1'],
        type: 'webhook',
      },
    ],
  })
  subscriptions!: TCustomerSubscription[];
}
