import { FieldLayout } from '@app/common/components/organisms/DynamicForm/components/layouts/FieldLayout';
import { SubmitButtonLayout } from '@app/common/components/organisms/DynamicForm/components/layouts/SubmitButtonLayout';
import { TemplatesType } from '@rjsf/utils';

const Filler = () => <div>filler</div>;

export const templates: Partial<TemplatesType> = {
  FieldTemplate: FieldLayout,
  ButtonTemplates: {
    SubmitButton: SubmitButtonLayout,
    MoveDownButton: Filler,
    MoveUpButton: Filler,
    AddButton: Filler,
    CopyButton: Filler,
    RemoveButton: Filler,
  },
};
