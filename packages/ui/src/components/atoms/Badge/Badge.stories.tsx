import { Badge } from './Badge';

export default {
  component: Badge,
};

export const Default = {
  render: () => <Badge>Click me</Badge>,
};

export const WarningBadge = {
  render: () => <Badge variant="warning">Warning Badge</Badge>,
};

export const SuccessBadge = {
  render: () => <Badge variant="success">Success Badge</Badge>,
};

export const DestructiveBadge = {
  render: () => <Badge variant="destructive">Desctructive Badge</Badge>,
};
