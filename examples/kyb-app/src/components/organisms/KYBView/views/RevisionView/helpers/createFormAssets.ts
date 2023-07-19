import { createFormSchema } from '@app/components/organisms/KYBView/views/RevisionView/helpers/createFormSchema';
import { createUISchema } from '@app/components/organisms/KYBView/views/RevisionView/helpers/createUISchema';
import { Workflow } from '@app/domains/workflows/types';

export type FormAssets = {
  uiSchema: ReturnType<typeof createUISchema>;
  schema: ReturnType<typeof createFormSchema>;
};

export const createFormAssets = (workfow: Workflow): FormAssets => {
  return {
    uiSchema: createUISchema(workfow),
    schema: createFormSchema(workfow),
  };
};
