import { UserWhereUniqueInput } from './user-where-unique-input';
import { UserUpdateDto } from './user-update';

export class UpdateUserArgs {
  where!: UserWhereUniqueInput;
  data!: UserUpdateDto;
}
