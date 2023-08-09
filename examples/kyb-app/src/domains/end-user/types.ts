import { AnyObject } from '@ballerine/ui';

export interface CreateEndUserDto {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  additionalInformation?: AnyObject;
}

export interface CreateEndUserResponse {
  endUserId: string;
  businessId: string;
}
