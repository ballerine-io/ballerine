import { useViewState } from '@app/common/providers/ViewStateProvider';
import { AppShell } from '@app/components/layouts/AppShell';
import { ViewHeader } from '@app/pages/CollectionFlow/components/organisms/KYBView/components/ViewHeader';
import { transformRJSFErrors } from '@app/pages/CollectionFlow/components/organisms/KYBView/helpers/transform-errors';
import { companyInformationSchema } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/CompanyInformationView/company-information.schema';
import { companyInformationUISchema } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/CompanyInformationView/company-information.ui-schema';
import { useCompanyInformation } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/CompanyInformationView/hooks/useCompanyInformation';
import { useCompanyInformationSchema } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/CompanyInformationView/hooks/useCompanyInformationSchema';
import { useCompanyInformationUISchema } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/CompanyInformationView/hooks/useCompanyInformationUISchema';
import { useCompanyInformationUpdate } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/CompanyInformationView/hooks/useCompanyInformationUpdate';
import { CompanyInformationContext } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/CompanyInformationView/types';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { DynamicForm } from '@ballerine/ui';
import { useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';

export const CompanyInformationView = () => {
  const { context, update, saveAndPerformTransition } = useViewState<WorkflowFlowData>();
  const [registrationNumber] = useDebounce(
    context.flowData.companyInformation.registrationNumber,
    1500,
  );
  const { companyInformation, isFetching } = useCompanyInformation({
    ...context.flowData.companyInformation,
    registrationNumber,
  });
  const { schema } = useCompanyInformationSchema(
    companyInformationSchema,
    context.flowData.companyInformation,
  );
  const { uiSchema } = useCompanyInformationUISchema(
    companyInformationUISchema,
    schema,
    isFetching,
  );

  const { handleUpdate } = useCompanyInformationUpdate();

  const contextRef = useRef<WorkflowFlowData>(context);

  useEffect(() => {
    contextRef.current = context;
  }, [context]);

  useEffect(() => {
    if (companyInformation) {
      void update(
        {
          ...contextRef.current.flowData.companyInformation,
          companyName: companyInformation.name,
          companyType: companyInformation.companyType,
          registrationDate: companyInformation.incorporationDate,
        },
        contextRef.current.shared,
        contextRef.current.completionMap['companyInformation'],
      );
    }
  }, [companyInformation, contextRef, update]);

  return (
    <AppShell.FormContainer header={<ViewHeader />}>
      <DynamicForm<CompanyInformationContext>
        className="max-w-[384px]"
        formData={context.flowData.companyInformation}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={values => void saveAndPerformTransition(values)}
        onChange={handleUpdate}
        transformErrors={transformRJSFErrors}
      />
    </AppShell.FormContainer>
  );
};
