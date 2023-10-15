import { TemplatesType } from '@rjsf/utils';
import { FieldLayout } from '@components/organisms/DynamicForm/components/layouts/FieldLayout';
import { TitleLayout } from '@components/organisms/DynamicForm/components/layouts/TitleLayout';
import { ArrayFieldsLayout } from '@components/organisms/DynamicForm/components/layouts/ArrayFieldsLayout';
import { SubmitLayout } from '@components/organisms/DynamicForm/components/layouts/buttons/SubmitLayout';

const Filler = () => <div>Not Implemented</div>;

export const layouts: Partial<TemplatesType> = {
  FieldTemplate: FieldLayout,
  TitleFieldTemplate: TitleLayout,
  ArrayFieldTemplate: ArrayFieldsLayout,
  ArrayFieldTitleTemplate: Filler,
  ButtonTemplates: {
    SubmitButton: SubmitLayout,
    MoveDownButton: Filler,
    MoveUpButton: Filler,
    // AddButton is rendered from ArrayFieldsLayout
    AddButton: () => null,
    CopyButton: Filler,
    RemoveButton: Filler,
  },
};
