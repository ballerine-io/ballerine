import { CustomerSubscriptionSchema } from './schemas/zod-schemas';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateNested } from 'class-validator';

export class CustomerModel {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  id!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  name!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  displayName!: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  customerStatus?: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  logoImageUri!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  faviconImageUri!: string;

  @ApiProperty({
    type: String,
  })
  @IsString()
  language?: string;
  @ApiProperty({
    type: String,
  })
  @IsString()
  country?: string;
}

class Subscription {
  @ApiProperty({
    required: true,
    type: String,
  })
  url!: string;

  @ApiProperty({
    required: true,
    type: [String],
  })
  events!: string[];

  @ApiProperty({
    required: true,
    type: String,
  })
  type!: string;
}

export class CustomerSubscriptionModel {
  @ApiProperty({
    type: [Subscription],
  })
  @ValidateNested({ each: true })
  subscriptions?: Subscription[];
}
