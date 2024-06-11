import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateBusinessReportSchema } from '@/pages/MerchantMonitoringCreateCheck/create-business-report-schema';
import { useCreateBusinessReportMutation } from '@/domains/business-reports/hooks/mutations/useCreateBusinessReportMutation/useCreateBusinessReportMutation';
import { z } from 'zod';
import { countryCodes } from '@ballerine/common';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { useCallback, useMemo } from 'react';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { MerchantMonitoringCreateBusinessReportPageSearchSchema } from '@/pages/MerchantMonitoringCreateCheck/hooks/useMerchantMonitoringCreateBusinessReportPageLogic/merchant-monitoring-create-business-report-page-search-schema';
import { useCustomerQuery } from '@/domains/customer/hook/queries/useCustomerQuery/userCustomerQuery';
import { useNavigate } from 'react-router-dom';

export const useMerchantMonitoringCreateBusinessReportPageLogic = () => {
  const form = useForm({
    defaultValues: {
      websiteUrl: '',
      companyName: undefined,
      operatingCountry: undefined,
      businessCorrelationId: undefined,
    },
    resolver: zodResolver(CreateBusinessReportSchema),
  });
  const { isLoading: isLoadingCustomer } = useCustomerQuery();
  const navigate = useNavigate();
  const { mutate: mutateCreateBusinessReport } = useCreateBusinessReportMutation({
    reportType: 'MERCHANT_REPORT_T1',
    onSuccess: () => {
      navigate(`/${locale}/merchant-monitoring`);
    },
  });
  const onSubmit: SubmitHandler<z.output<typeof CreateBusinessReportSchema>> = data => {
    mutateCreateBusinessReport(data);
  };
  const comboboxCountryCodes = useMemo(
    () =>
      countryCodes.map(countryCode => ({
        label: countryCode,
        value: countryCode,
      })),
    [],
  );
  const locale = useLocale();
  const [
    {
      changeChecksConfiguration: isChangeChecksConfigurationOpen,
      changeRiskAppetiteConfiguration: isChangeRiskAppetiteConfigurationOpen,
    },
    setSearchQueryParams,
  ] = useZodSearchParams(MerchantMonitoringCreateBusinessReportPageSearchSchema);
  const toggleIsChangeChecksConfigurationOpen = useCallback(() => {
    setSearchQueryParams({
      changeChecksConfiguration:
        typeof isChangeChecksConfigurationOpen === 'undefined'
          ? true
          : !isChangeChecksConfigurationOpen,
    });
  }, [isChangeChecksConfigurationOpen, setSearchQueryParams]);
  const toggleIsChangeRiskAppetiteConfigurationOpen = useCallback(() => {
    setSearchQueryParams({
      changeRiskAppetiteConfiguration:
        typeof isChangeRiskAppetiteConfigurationOpen === 'undefined'
          ? true
          : !isChangeRiskAppetiteConfigurationOpen,
    });
  }, [isChangeRiskAppetiteConfigurationOpen, setSearchQueryParams]);

  const checksConfiguration = useMemo(
    () =>
      [
        {
          label: 'KYC (Requires collection flow)',
          options: [
            { label: 'Identity Verification', name: 'identityVerification' },
            { label: 'Sanctions', name: 'sanctions' },
            { label: 'Adverse Media', name: 'adverseMedia' },
            { label: 'Politically Exposed Person (PEP)', name: 'politicallyExposedPerson' },
          ],
        },
        {
          label: 'KYB (Requires collection flow)',
          options: [
            { label: 'Registry Check', name: 'registryCheck' },
            { label: 'Address Check', name: 'addressCheck' },
            { label: 'Contact Information Check', name: 'contactInformationCheck' },
            { label: 'Ultimate Beneficial Ownership (UBO)', name: 'ultimateBeneficialOwnership' },
          ],
        },
        {
          label: 'Ecosystem',
          options: [
            { label: 'Connectors Extraction', name: 'connectorsExtraction' },
            { label: 'Test Transactions', name: 'testTransactions' },
          ],
        },
        {
          label: 'Line of Business Analysis',
          options: [
            { label: 'Line of Business Extraction', name: 'lineOfBusinessExtraction' },
            { label: 'Content Violations', name: 'contentViolations' },
          ],
        },
      ] as const,
    [],
  );
  const riskLabels = useMemo(
    () =>
      [
        'Adult Content',
        'Drug Paraphernalia',
        'Illegal Substances',
        'Negative Option Billing',
        'Racism',
        'Beastiality',
        'ENDS Products',
        'Child Pornography',
        'Firearms',
        'IP Rights Infringement',
        'Cold Weapons',
        'Forex',
        'IPTV',
        'Nutraceuticals',
        'Violence',
        'Illegal Wildlife Trade',
        'Online Gaming',
        'Pharmaceuticals/Prescription Drugs',
        'Sanctions',
        'Cyber Lockers',
        'Gambling',
        'Marijuana',
        'Pharma OTC (Over the Counter)',
        'Adult Live Streaming',
        'Dating Services',
        'Government Documents & IDs',
        'Medical Devices',
        'Prostitution',
      ] as const,
    [],
  );
  const disabledChecksConfiguration = useMemo(
    () =>
      checksConfiguration?.map(config => ({
        ...config,
        options: config.options.map(option => ({
          ...option,
          disabled: true,
        })),
      })),
    [checksConfiguration],
  );

  const industries = useMemo(
    () =>
      [
        { id: 'general', value: 'General' },
        { id: 'adultEntertainment', value: 'Adult Entertainment' },
        { id: 'crypto', value: 'Crypto' },
        { id: 'dropshipping', value: 'Dropshipping' },
        { id: 'financialServices', value: 'Financial Services' },
        { id: 'gamingAndGambling', value: 'Gaming & Gambling' },
        { id: 'marketplaces', value: 'Marketplaces' },
        { id: 'pharma', value: 'Pharma' },
        { id: 'subscriptionBased', value: 'Subscription Based' },
        { id: 'travel', value: 'Travel' },
      ] as const,
    [],
  );

  return {
    form,
    onSubmit,
    comboboxCountryCodes,
    locale,
    isChangeChecksConfigurationOpen,
    toggleIsChangeChecksConfigurationOpen,
    isChangeRiskAppetiteConfigurationOpen,
    toggleIsChangeRiskAppetiteConfigurationOpen,
    checksConfiguration: disabledChecksConfiguration,
    riskLabels,
    industries,
    isLoadingCustomer,
  };
};
