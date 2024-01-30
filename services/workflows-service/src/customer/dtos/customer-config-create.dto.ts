import { ApiProperty } from '@nestjs/swagger';
import type { TCustomerSubscription } from '../schemas/zod-schemas';

export class CustomerConfigCreateDto {
  @ApiProperty({
    required: true,
    type: Object,
  })
  subscriptions!: TCustomerSubscription;
}

// import { z } from 'nestjs-zod/z';
// export class CustomerConfigCreateDto extends createZodDto(z.object({ config: CustomerConfigSchema })) {}
