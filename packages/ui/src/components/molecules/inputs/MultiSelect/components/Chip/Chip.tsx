import { Badge, BadgeProps } from '@/components/atoms/Badge';
import { Label } from '@/components/molecules/inputs/MultiSelect/components/Chip/Label';
import { UnselectButton } from '@/components/molecules/inputs/MultiSelect/components/Chip/UnselectButton';

export type MultiselectChipProps = BadgeProps;

export const Chip = ({ className, children, ...badgeProps }: MultiselectChipProps) => {
  return (
    <Badge className={className} {...badgeProps}>
      {children}
    </Badge>
  );
};

Chip.Label = Label;
Chip.UnselectButton = UnselectButton;
