import { createTestId, IRendererComponent } from '@ballerine/ui';
import DOMPurify from 'dompurify';

export const RawDescription: IRendererComponent<{}, { descriptionRaw: string }> = ({
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
