import { Badge } from './Badge';

export default {
  component: Badge,
};

export const Default = {
  render: () => <Badge>Click me</Badge>,
};

export const Warning = {
  render: () => <Badge variant="warning">Click me</Badge>,
};
