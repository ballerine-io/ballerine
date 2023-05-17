import { BusinessWhereInput } from '@/business/dtos/business-where-input';
import { BusinessSelect } from '@/business/dtos/business-select';

export class BusinessQueryDto {
  select?: BusinessSelect;
  where?: BusinessWhereInput;
}
