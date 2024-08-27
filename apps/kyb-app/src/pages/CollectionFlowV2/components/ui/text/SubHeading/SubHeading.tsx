import { createTestId, IRendererComponent } from '@ballerine/ui';

export const SubHeading: IRendererComponent<{}, { text: string }> = ({
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
