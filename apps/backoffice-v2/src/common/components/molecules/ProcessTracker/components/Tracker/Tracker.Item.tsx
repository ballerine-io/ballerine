import { AccordionCard, AccordionCardItemProps } from '@ballerine/ui';

interface ITrackerItemProps extends AccordionCardItemProps {
  children?: React.ReactNode;
}

export const Item = (props: ITrackerItemProps) => <AccordionCard.Item {...props} />;
