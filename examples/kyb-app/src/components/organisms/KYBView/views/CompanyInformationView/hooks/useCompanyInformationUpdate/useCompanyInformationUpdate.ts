import { useViewState } from '@app/common/providers/ViewStateProvider';
import { CompanyInformationContext } from '@app/components/organisms/KYBView/views/CompanyInformationView/types';
import { defaultFlowData } from '@app/domains/workflows/default-flow-data';
import { WorkflowFlowData } from '@app/domains/workflows/flow-data.type';
import { useCallback, useRef } from 'react';

export const useCompanyInformationUpdate = () => {
  const { context, update } = useViewState<WorkflowFlowData>();
  const prevCountryRef = useRef(context.flowData.companyInformation.companyCountry);

  const handleUpdate = useCallback(
    (values: CompanyInformationContext) => {
      const isCountryChanged = prevCountryRef.current !== values.companyCountry;

      if (isCountryChanged) {
        prevCountryRef.current = values.companyCountry;
      }

      void update(
        isCountryChanged
          ? {
              ...defaultFlowData.flowData.companyInformation,
              registrationNumber: values.registrationNumber,
              companyCountry: values.companyCountry,
            }
          : values,
      );
    },
    [prevCountryRef, update],
  );

  return {
    handleUpdate,
  };
};
