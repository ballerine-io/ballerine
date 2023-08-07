import { useCompanyInformationQuery } from '@app/components/organisms/KYBView/hooks/useCompanyInformationQuery';
import {
  AUTOFILLABLE_FIELDS,
  COUNTRIES_WITH_STATES,
} from '@app/components/organisms/KYBView/views/CompanyInformationView/const';
import { CompanyInformationContext } from '@app/components/organisms/KYBView/views/CompanyInformationView/types';
import { useMemo } from 'react';

export const useCompanyInformation = (formData: CompanyInformationContext) => {
  const isStateSelectionRequired = useMemo(
    () => COUNTRIES_WITH_STATES.includes(formData.companyCountry?.toLowerCase()),
    [formData.companyCountry],
  );

  const isCanFetchAutofillData = useMemo(() => {
    if (!formData.registrationNumber || !formData.companyCountry) return false;

    if (isStateSelectionRequired) {
      if (!formData.state) return false;

      return true;
    }

    return true;
  }, [formData, isStateSelectionRequired]);

  const isShouldFetchAutofillData = useMemo(() => {
    return !AUTOFILLABLE_FIELDS.some(fieldName =>
      Boolean(formData[fieldName as keyof typeof formData]),
    );
  }, [formData]);

  const jurisdictionCode = useMemo(
    () =>
      isStateSelectionRequired
        ? `${formData.companyCountry}-${formData.state}`
        : formData.companyCountry,
    [isStateSelectionRequired, formData.state, formData.companyCountry],
  );

  const { data: companyInformation, isFetching } = useCompanyInformationQuery(
    formData.registrationNumber,
    jurisdictionCode,
    isCanFetchAutofillData && isShouldFetchAutofillData,
  );

  return {
    companyInformation: companyInformation ?? null,
    isFetching,
  };
};
