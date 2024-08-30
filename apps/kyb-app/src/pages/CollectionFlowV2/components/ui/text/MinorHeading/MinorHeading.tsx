import { IUIComponentProps } from '@/pages/CollectionFlowV2/types';
import { createTestId } from '@ballerine/ui';
import { FunctionComponent } from 'react';

export const MinorHeading: FunctionComponent<IUIComponentProps<{ text: string }>> = ({
  stack,
  definition,
  options,
}) => {
  return (
    <h4 className="pb-3 text-base font-bold" data-test-id={createTestId(definition, stack)}>
      {options?.text}
    </h4>
  );
};
