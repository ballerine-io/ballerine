import { SubmitButton } from '@/components/molecules/SubmitButton/SubmitButton';

export default {
  component: SubmitButton,
};

export const Default = {
  render: () => <SubmitButton>Click me!</SubmitButton>,
};

export const Submiting = {
  render: () => <SubmitButton isLoading>Hello World</SubmitButton>,
};
