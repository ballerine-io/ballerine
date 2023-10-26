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
import { usePageResolverContext } from '@app/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';

const { Provider } = pageContext;

export interface PageProps {
  page: UIPage;
  children: AnyChildren;
}

export const Page = ({ page, children }: PageProps) => {
  const { pages } = usePageResolverContext();
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
  const fieldErrors = useMemo(
    () => rulesResult.reduce((errors, item) => errors.concat(item.errors), [] as ErrorField[]),
    [rulesResult],
  );

  const pageErrors = usePageErrors(payload, pages);

  const context = useMemo(() => {
    const ctx: PageContext = {
      errors: fieldErrors.reduce((map, item) => {
        if (!item.fieldId) return map;

        map[item.fieldId] = item;
        return map;
      }, {} as PageContext['errors']),
      pageErrors: pageErrors.reduce((map, pageError) => {
        map[pageError.stateName] = pageError.errors.reduce((map, error) => {
          map[error.fieldId] = error;
          return map;
        }, {});

        return map;
      }, {}),
    };

    return ctx;
  }, [fieldErrors, pageErrors]);

  return <Provider value={context}>{children}</Provider>;
};
