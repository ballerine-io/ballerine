import { ErrorField } from '@app/components/organisms/DynamicUI/rule-engines';
import { UIElementDestination } from '@app/domains/collection-flow';

export interface PageContext {
  errors: Record<UIElementDestination, ErrorField>;
}
