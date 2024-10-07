import { UIElementV2 } from '@/components/providers/Validator/types';
import { SubmitButton } from '@/pages/CollectionFlowV2/components/ui/controls/SubmitButton';
import { CheckboxField } from '@/pages/CollectionFlowV2/components/ui/fields/CheckboxField';
import { DateField } from '@/pages/CollectionFlowV2/components/ui/fields/DateField';
import { DocumentField } from '@/pages/CollectionFlowV2/components/ui/fields/DocumentField';
import { FieldList } from '@/pages/CollectionFlowV2/components/ui/fields/FieldList';
import { PhoneField } from '@/pages/CollectionFlowV2/components/ui/fields/PhoneField';
import { TextField } from '@/pages/CollectionFlowV2/components/ui/fields/TextField';
import { Container } from '@/pages/CollectionFlowV2/components/ui/layout/Container';
import { Heading } from '@/pages/CollectionFlowV2/components/ui/text/Heading';
import { MinorHeading } from '@/pages/CollectionFlowV2/components/ui/text/MinorHeading';
import { RawDescription } from '@/pages/CollectionFlowV2/components/ui/text/RawDescription/RawDescription';
import { SubHeading } from '@/pages/CollectionFlowV2/components/ui/text/SubHeading';
import { withConnectedField } from '@/pages/CollectionFlowV2/hocs/withConnectedField';
import { withConnectedUIElement } from '@/pages/CollectionFlowV2/hocs/withConnectedUIElement';
import { IFieldComponentProps, IUIComponentProps } from '@/pages/CollectionFlowV2/types';
import { IRendererComponent } from '@ballerine/ui';
import merge from 'lodash/merge';
import { FunctionComponent } from 'react';

type TUIElement =
  | FunctionComponent<IUIComponentProps<any>>
  | FunctionComponent<IFieldComponentProps<any, any>>;

type TRendererElement = IRendererComponent<
  UIElementV2,
  IUIComponentProps<unknown> | IFieldComponentProps<unknown, unknown>
>;

const applyHocToElements = (
  elements: Record<string, TUIElement>,
  hoc: typeof withConnectedUIElement | typeof withConnectedField,
) => {
  const result: Record<string, TRendererElement> = {};

  Object.keys(elements).forEach(key => {
    //@ts-ignore
    result[key as keyof typeof elements] = hoc(elements[key]!);
  });

  return result;
};

const textUIElements = applyHocToElements(
  {
    heading: Heading,
    subheading: SubHeading,
    minorheading: MinorHeading,
    description: RawDescription,
    container: Container,
  },
  withConnectedUIElement,
);

const controlsUIElements = applyHocToElements(
  {
    'submit-button': SubmitButton,
  },
  withConnectedUIElement,
);

export const fieldElelements = applyHocToElements(
  {
    textfield: TextField,
    datefield: DateField,
    phonefield: PhoneField,
    documentfield: DocumentField,
    fieldlist: FieldList,
    checkbox: CheckboxField,
  },
  withConnectedField,
);

export const rendererSchema = merge(textUIElements, controlsUIElements, fieldElelements);
