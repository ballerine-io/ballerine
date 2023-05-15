import { z } from 'zod';
import { EndUserByIdSchema, EndUsersListSchema } from '../lib/zod/schemas/end-users';
import {AuthenticatedUserSchema} from "../lib/zod/schemas/authenticated-user";

export type TEndUser = z.infer<typeof EndUserByIdSchema>;

export type TEndUsers = z.infer<typeof EndUsersListSchema>;
export type TAuthenticatedUser = z.infer<typeof AuthenticatedUserSchema>;

export type TCaseManagementState = {
  state: string,
  readEnabled: boolean,
  writeEnabled: boolean,
  assignToMeEnabled: boolean,
  assignToOther: boolean,
  unassignedEnabled?: boolean,
  actionButtonsEnabled: boolean,
};
