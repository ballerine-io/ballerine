import { IUIComponentProps } from '@/pages/CollectionFlowV2/types';
import { createTestId } from '@ballerine/ui';
import { FunctionComponent } from 'react';

export const Heading: FunctionComponent<IUIComponentProps<{ text: string }>> = ({
  definition,
  stack,
  options,
}) => {
  return (
    <h1 className="pb-6 pt-4 text-3xl font-bold" data-test-id={createTestId(definition, stack)}>
      {options?.text}
    </h1>
  );
};
