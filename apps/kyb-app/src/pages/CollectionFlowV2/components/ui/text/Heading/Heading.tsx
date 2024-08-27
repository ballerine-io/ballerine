import { createTestId, IRendererComponent } from '@ballerine/ui';

export const Heading: IRendererComponent<{}, { text: string }> = ({
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
