import { useCompanyInformationQuery } from '@app/pages/CollectionFlow/components/organisms/KYBView/hooks/useCompanyInformationQuery';
import { COUNTRIES_WITH_STATES } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/CompanyInformationView/const';
import { CompanyInformationContext } from '@app/pages/CollectionFlow/components/organisms/KYBView/views/CompanyInformationView/types';
import { useMemo, useRef } from 'react';
import isEqual from 'lodash/isEqual';

interface FetchData {
  registrationNumber: string;
  country: string;
  state?: string;
}

function getFetchData(formData: CompanyInformationContext): FetchData {
  return {
    registrationNumber: formData.registrationNumber,
    country: formData.companyCountry,
    state: formData.state,
  };
}

export const useCompanyInformation = (formData: CompanyInformationContext) => {
  const isStateSelectionRequired = useMemo(
    () => COUNTRIES_WITH_STATES.includes(formData.companyCountry?.toLowerCase()),
    [formData.companyCountry],
  );

  const fetchDataRef = useRef<FetchData>(getFetchData(formData));

  const isCanFetchAutofillData = useMemo(() => {
    if (!formData.registrationNumber || !formData.companyCountry) return false;

    if (isStateSelectionRequired) {
      if (!formData.state) return false;

      return true;
    }

    return true;
  }, [formData, isStateSelectionRequired]);

  const isShouldFetchAutofillData = useMemo(() => {
    if (!isCanFetchAutofillData) return false;

    if (isEqual(fetchDataRef.current, formData)) return false;

    return true;
  }, [fetchDataRef, isCanFetchAutofillData, formData]);

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
