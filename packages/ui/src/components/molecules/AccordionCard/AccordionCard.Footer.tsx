import { ComponentProps, FunctionComponent } from 'react';
import { CardFooter } from '@/components';

export const AccordionCardFooter: FunctionComponent<ComponentProps<typeof CardFooter>> = ({
  children,
  ...props
}) => {
  return (
    <CardFooter {...props} className={props?.className}>
      {children}
    </CardFooter>
  );
};
AccordionCardFooter.displayName = 'AccordionCard.Footer';
