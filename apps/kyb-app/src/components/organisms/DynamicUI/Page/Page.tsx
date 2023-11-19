import { usePageErrors } from '@/components/organisms/DynamicUI/Page/hooks/usePageErrors';
import { PageContext } from '@/components/organisms/DynamicUI/Page/types';
import { usePageResolverContext } from '@/components/organisms/DynamicUI/PageResolver/hooks/usePageResolverContext';
import { useStateManagerContext } from '@/components/organisms/DynamicUI/StateManager/components/StateProvider';
import { useDynamicUIContext } from '@/components/organisms/DynamicUI/hooks/useDynamicUIContext';
import { useRuleExecutor } from '@/components/organisms/DynamicUI/hooks/useRuleExecutor';
import { ErrorField } from '@/components/organisms/DynamicUI/rule-engines';
import { UIElement, UIPage } from '@/domains/collection-flow';
import { AnyChildren, AnyObject } from '@ballerine/ui';
import { useMemo } from 'react';
import { pageContext } from './page.context';

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

  const rules = useMemo(
    () => (Array.isArray(page.pageValidation) ? page.pageValidation : []),
    [page],
  );

  const { payload } = useStateManagerContext();
  const { state } = useDynamicUIContext();
  const rulesResult = useRuleExecutor(payload, rules, definition, state);
  const fieldErrors = useMemo(
    () =>
      rulesResult.reduce(
        (errors, item) =>
          errors.concat(
            // @ts-ignore
            item.errors,
          ),
        [] as ErrorField[],
      ),
    [rulesResult],
  );

  const pageErrors = usePageErrors(payload, pages);

  const context = useMemo(() => {
    const ctx: PageContext = {
      errors: fieldErrors.reduce((map, item) => {
        if (!item.fieldId) return map;

        const isExists = map[item.fieldId];

        if (isExists) {
          map[item.fieldId].push(item);
        } else {
          map[item.fieldId] = [item];
        }

        return map;
      }, {} as PageContext['errors']),
      pageErrors: pageErrors.reduce((map, pageError) => {
        map[pageError.stateName] = pageError.errors.reduce((map, error) => {
          map[error.fieldId] = error;
          return map;
        }, {} as PageContext['pageErrors'][string]);

        return map;
      }, {} as PageContext['pageErrors']),
    };

    return ctx;
  }, [fieldErrors, pageErrors]);

  return <Provider value={context}>{children}</Provider>;
};
