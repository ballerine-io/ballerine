import { UIElement, UIPage } from '@app/domains/collection-flow';
import { AnyChildren, AnyObject } from '@ballerine/ui';
import { useStateManagerContext } from '@app/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useMemo } from 'react';
import { useRuleExecutor } from '@app/components/organisms/DynamicUI/hooks/useRuleExecutor';
import { useDynamicUIContext } from '@app/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { PageContext } from '@app/components/organisms/DynamicUI/Page/types';
import { ErrorField } from '@app/components/organisms/DynamicUI/rule-engines';
import { pageContext } from './page.context';
import { usePageErrors } from '@app/components/organisms/DynamicUI/Page/hooks/usePageErrors';

const { Provider } = pageContext;

export interface PageProps {
  page: UIPage;
  children: AnyChildren;
}

export const Page = ({ page, children }: PageProps) => {
  const definition = useMemo(() => {
    const definition: UIElement<AnyObject> = {
      type: 'page',
      name: page.name,
      options: {},
    };

    return definition;
  }, [page]);

  const rules = useMemo(() => (page.pageValidator ? [page.pageValidator] : []), [page]);

  const { payload } = useStateManagerContext();
  const { state } = useDynamicUIContext();
  const rulesResult = useRuleExecutor(payload, rules, definition, state);
  const documentErrors = usePageErrors(payload);

  const context = useMemo(() => {
    const ctx: PageContext = {
      errors: rulesResult
        .reduce((errors, item) => errors.concat(item.errors), [] as ErrorField[])
        .concat(documentErrors)
        .reduce((map, item) => {
          if (!item.fieldId) return map;

          map[item.fieldId] = item;
          return map;
        }, {} as PageContext['errors']),
    };

    return ctx;
  }, [rulesResult, documentErrors]);

  return <Provider value={context}>{children}</Provider>;
};
