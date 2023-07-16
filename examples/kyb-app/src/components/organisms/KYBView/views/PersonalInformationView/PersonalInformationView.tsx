import { DynamicForm } from '@app/common/components/organisms/DynamicForm';
import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { formSchema } from '@app/components/organisms/KYBView/views/PersonalInformationView/form.schema';

export const PersonalInformationView = () => {
  const { next } = useViewState();

  return (
    <AppShell.FormContainer>
      <DynamicForm
        className="max-w-[384px]"
        uiSchema={{
          'ui:options': {
            submitButtonOptions: {
              submitText: 'Continue',
            },
          },
        }}
        schema={formSchema}
        onSubmit={values => next(values)}
      />
    </AppShell.FormContainer>
  );
};
