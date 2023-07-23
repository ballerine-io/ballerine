export interface CreateEndUserDto {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  companyName: string;
}

export interface CreateEndUserResponse {
  endUserId: string;
  businessId: string;
}
