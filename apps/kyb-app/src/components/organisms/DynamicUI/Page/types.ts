import { ErrorField } from '@/components/organisms/DynamicUI/rule-engines';
import { UIElementDestination } from '@/domains/collection-flow';

export interface PageContext {
  errors: Record<UIElementDestination, ErrorField>;
  pageErrors: Record<string, Record<UIElementDestination, ErrorField>>;
}
