import { TUsers } from '../../../../domains/users/types';

export type TAssignee = Pick<TUsers[number], 'id' | 'fullName'>;
