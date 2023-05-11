import { EndUserSelect } from '@/end-user/dtos/end-user-select';
import { EndUserWhereInput } from '@/end-user/dtos/end-user-where-input';

export class EndUserQueryDto {
  select?: EndUserSelect;
  where?: EndUserWhereInput;
}
