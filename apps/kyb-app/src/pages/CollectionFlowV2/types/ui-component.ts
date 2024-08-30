import { UIElementV2 } from '@/components/providers/Validator/types';

export interface IUIComponentProps<TOptions = {}> {
  definition: UIElementV2;
  options: TOptions;
  stack?: number[];
}
