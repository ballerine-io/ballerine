import { Checkbox } from './Checkbox';

export default {
  component: Checkbox,
};

export const Default = { render: () => <Checkbox /> };

export const Disabled = { render: () => <Checkbox disabled /> };
