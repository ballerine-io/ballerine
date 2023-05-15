import { z } from 'zod';
import { EndUserByIdSchema, EndUsersListSchema } from '../lib/zod/schemas/end-users';

export type TEndUser = z.infer<typeof EndUserByIdSchema>;

export type TEndUsers = z.infer<typeof EndUsersListSchema>;

export type TCaseManagementState = {
  state: string,
  readEnabled: boolean,
  writeEnabled: boolean,
  assignToMeEnabled: boolean,
  assignToOther: boolean,
};
