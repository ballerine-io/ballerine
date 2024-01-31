import { useContext } from 'react';
import { AccordionCardContext } from '@/components/molecules/AccordionCard/context/AccordionCardProvider/AccordionCardProvider';

export const useAccordionCardContext = () => {
  const values = useContext(AccordionCardContext);

  if (!values) {
    throw new Error('useAccordionCardContext must be used within a AccordionCardContext.');
  }

  return values;
};
