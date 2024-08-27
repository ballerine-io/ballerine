import { createTestId, IRendererComponent } from '@ballerine/ui';

export const MinorHeading: IRendererComponent<{}, { text: string }> = ({
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
