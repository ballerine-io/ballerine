import { z } from 'zod';
import { IndividualByIdSchema, IndividualsListSchema } from '../individuals/validation-schemas';
import { FileInfoSchema } from '../lib/zod/schemas/file-info';
import { AuthenticatedUserSchema } from '../lib/zod/schemas/authenticated-user';
import { UsersListSchema } from '../lib/zod/schemas/users';

export type TEndUser = z.infer<typeof IndividualByIdSchema>;

export type TEndUsers = z.infer<typeof IndividualsListSchema>;
export type TUsers = z.infer<typeof UsersListSchema>;
export type TAuthenticatedUser = z.infer<typeof AuthenticatedUserSchema>;

export type TCaseManagementState = {
  state: string;
  readEnabled: boolean;
  writeEnabled: boolean;
  assignToMeEnabled: boolean;
  assignToOtherEnabled: boolean;
  unassignedEnabled?: boolean;
  actionButtonsEnabled: boolean;
};
export type TFileInfo = z.infer<typeof FileInfoSchema>;
