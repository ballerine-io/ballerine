import { FunctionComponent } from 'react';
import { AccordionTrigger } from '@/components/molecules/Accordion/Accordion.Trigger';
import { AccordionContent } from '@/components/molecules/Accordion/Accordion.Content';
import { AccordionItem as ShadCNAccordionItem } from '@/components/molecules/Accordion/Accordion.Item';
import { CheckCircle2, Clock4, MinusCircle, XCircle } from 'lucide-react';

export const AccordionItem: FunctionComponent = ({ title, value, subitems }) => {
  return (
    <ShadCNAccordionItem value={value}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>
        <ul className={`flex flex-col space-y-2`}>
          {subitems?.map(({ leftIcon, text, rightIcon }) => (
            <li className={`flex items-center gap-x-2`} key={text}>
              {leftIcon}
              {text}
              {rightIcon}
            </li>
          ))}
          <li className={`flex items-center gap-x-2`}>
            <Clock4 size={18} className={`stroke-purple-500`} />
            Registry Verification
          </li>
          <li className={`flex items-center gap-x-2`}>
            <CheckCircle2 size={18} className={`stroke-green-500`} />
            UBO Check
          </li>
          <li className={`flex items-center gap-x-2`}>
            <MinusCircle size={18} className={`stroke-slate-500`} /> Company Sanctions
          </li>
          <li className={`flex items-center gap-x-2`}>
            <XCircle size={18} className={`stroke-red-500`} /> Address Verification
          </li>
        </ul>
      </AccordionContent>
    </ShadCNAccordionItem>
  );
};
AccordionItem.displayName = 'Accordion.Item';
