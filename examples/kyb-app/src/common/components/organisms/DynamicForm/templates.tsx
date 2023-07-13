import { FieldLayout } from '@app/common/components/organisms/DynamicForm/components/layouts/FieldLayout';
import { SubmitLayout } from '@app/common/components/organisms/DynamicForm/components/layouts/buttons/SubmitLayout';
import { TitleLayout } from '@app/common/components/organisms/DynamicForm/components/layouts/TitleLayout';
import { TemplatesType } from '@rjsf/utils';
import { ArrayFieldsLayout } from '@app/common/components/organisms/DynamicForm/components/layouts/ArrayFieldsLayout';

const Filler = () => <div>filler</div>;

export const templates: Partial<TemplatesType> = {
  FieldTemplate: FieldLayout,
  TitleFieldTemplate: TitleLayout,
  ArrayFieldTemplate: ArrayFieldsLayout,
  ArrayFieldTitleTemplate: () => <div>123</div>,
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
