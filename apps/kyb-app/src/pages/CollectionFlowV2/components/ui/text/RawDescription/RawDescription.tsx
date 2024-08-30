import { IUIComponentProps } from '@/pages/CollectionFlowV2/types';
import { createTestId } from '@ballerine/ui';
import DOMPurify from 'dompurify';
import { FunctionComponent } from 'react';

export const RawDescription: FunctionComponent<IUIComponentProps<{ descriptionRaw: string }>> = ({
  stack,
  definition,
  options,
}) => {
  return (
    <p
      className="font-inter pb-2 text-sm text-slate-500"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(options?.descriptionRaw || '') as string,
      }}
      data-test-id={createTestId(definition, stack)}
    ></p>
  );
};
