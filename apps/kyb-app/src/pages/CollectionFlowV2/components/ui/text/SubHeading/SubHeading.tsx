import { IUIComponentProps } from '@/pages/CollectionFlowV2/types';
import { createTestId } from '@ballerine/ui';
import { FunctionComponent } from 'react';

export const SubHeading: FunctionComponent<IUIComponentProps<{ text: string }>> = ({
  definition,
  stack,
  options,
}) => {
  return (
    <h3 className="pt-4 text-xl font-bold" data-test-id={createTestId(definition, stack)}>
      {options?.text}
    </h3>
  );
};
