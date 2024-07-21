import { Cell } from '@/components/organisms/UIRenderer/elements/Cell';
import { Divider } from '@/components/organisms/UIRenderer/elements/Divider';
import { JSONForm } from '@/components/organisms/UIRenderer/elements/JSONForm/JSONForm';
import { StepperUI } from '@/components/organisms/UIRenderer/elements/StepperUI';
import { SubmitButton } from '@/components/organisms/UIRenderer/elements/SubmitButton';
import { Title } from '@/components/organisms/UIRenderer/elements/Title';
import { AnyObject } from '@ballerine/ui';
import DOMPurify from 'dompurify';

export const collectionFlowElements = {
  h1: Title,
  h3: (props: AnyObject) => <h3 className="pt-4 text-xl font-bold">{props?.options?.text}</h3>,
  h4: (props: AnyObject) => <h4 className="pb-3 text-base font-bold">{props?.options?.text}</h4>,
  description: (props: AnyObject) => (
    <p
      className="font-inter pb-2 text-sm text-slate-500"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(props.options.descriptionRaw) as string,
      }}
    ></p>
  ),
  'json-form': JSONForm,
  container: Cell,
  mainContainer: Cell,
  'submit-button': SubmitButton,
  stepper: StepperUI,
  divider: Divider,
};
