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

  const riskLabels = useMemo(
    () =>
      [
        { label: 'Adult Content', defaultValue: 'criticalRisk', disabled: false },
        { label: 'Drug Paraphernalia', defaultValue: 'highRisk', disabled: false },
        { label: 'Illegal Substances', defaultValue: 'criticalRisk', disabled: false },
        { label: 'Negative Option Billing', defaultValue: 'highRisk', disabled: false },
        { label: 'Racism', defaultValue: 'highRisk', disabled: false },
        { label: 'Beastiality', defaultValue: 'criticalRisk', disabled: true },
        { label: 'ENDS Products', defaultValue: 'highRisk', disabled: false },
        { label: 'Illegal Wildlife Trade', defaultValue: 'criticalRisk', disabled: false },
        { label: 'Nutraceuticals', defaultValue: 'moderateRisk', disabled: false },
        { label: 'Child Pornography', defaultValue: 'criticalRisk', disabled: true },
        { label: 'Firearms', defaultValue: 'highRisk', disabled: false },
        { label: 'IP Rights Infringement', defaultValue: 'criticalRisk', disabled: false },
        { label: 'Online Gaming', defaultValue: 'highRisk', disabled: false },
        { label: 'Cold Weapons', defaultValue: 'moderateRisk', disabled: false },
        { label: 'Forex', defaultValue: 'highRisk', disabled: false },
        { label: 'IPTV', defaultValue: 'highRisk', disabled: false },
        { label: 'Pharmaceuticals/Prescription', defaultValue: 'criticalRisk', disabled: false },
        { label: 'Violence', defaultValue: 'criticalRisk', disabled: true },
        { label: 'Cyber Lockers', defaultValue: 'highRisk', disabled: false },
        { label: 'Gambling', defaultValue: 'criticalRisk', disabled: false },
        { label: 'Marijuana', defaultValue: 'criticalRisk', disabled: false },
        { label: 'Pharma OTC (Over the Counter)', defaultValue: 'moderateRisk', disabled: false },
        { label: 'Sanctions', defaultValue: 'criticalRisk', disabled: true },
        { label: 'Dating Services', defaultValue: 'moderateRisk', disabled: false },
        { label: 'Government Documents & IDs', defaultValue: 'highRisk', disabled: false },
        { label: 'Medical Devices', defaultValue: 'moderateRisk', disabled: false },
        { label: 'Prostitution', defaultValue: 'criticalRisk', disabled: true },
        { label: 'Adult Live Streaming', defaultValue: 'criticalRisk', disabled: false },
      ] as const,
    [],
  );
  const checksConfiguration = useMemo(
    () => [
      {
        label: 'KYC (Requires collection flow)',
        options: [
          {
            label: 'Identity Verification',
            name: 'identityVerification',
            defaultChecked: false,
            disabled: false,
          },
          { label: 'Sanctions', name: 'sanctions', defaultChecked: false, disabled: false },
          { label: 'Adverse Media', name: 'adverseMedia', defaultChecked: false, disabled: false },
          {
            label: 'Politically Exposed Person (PEP)',
            name: 'politicallyExposedPerson',
            defaultChecked: false,
            disabled: false,
          },
        ],
      },
      {
        label: 'KYB (Requires collection flow)',
        options: [
          {
            label: 'Registry Check',
            name: 'registryCheck',
            defaultChecked: false,
            disabled: false,
          },
          { label: 'Address Check', name: 'addressCheck', defaultChecked: false, disabled: false },
          {
            label: 'Contact Information Check',
            name: 'contactInformationCheck',
            defaultChecked: false,
            disabled: false,
          },
          {
            label: 'Ultimate Beneficial Ownership (UBO)',
            name: 'ultimateBeneficialOwnership',
            defaultChecked: false,
            disabled: false,
          },
        ],
      },
      {
        label: 'Ecosystem',
        options: [
          {
            label: 'Connectors Extraction',
            name: 'connectorsExtraction',
            defaultChecked: true,
            disabled: false,
          },
          {
            label: 'Test Transactions',
            name: 'testTransactions',
            defaultChecked: false,
            disabled: true,
          },
        ],
      },
      {
        label: 'Line of Business Analysis',
        options: [
          {
            label: 'Line of Business Extraction',
            name: 'lineOfBusinessExtraction',
            defaultChecked: true,
            disabled: false,
          },
          {
            label: 'Content Violations',
            name: 'contentViolations',
            defaultChecked: true,
            disabled: false,
          },
        ],
      },
      {
        label: 'Transaction Laundering Risk',
        options: [
          {
            label: 'Business Consistency',
            name: 'businessConsistency',
            defaultChecked: true,
            disabled: false,
          },
          {
            label: 'Scam and Fraud Indicators',
            name: 'scamAndFraudIndicators',
            defaultChecked: true,
            disabled: false,
          },
          { label: 'MATCH Query', name: 'matchQuery', defaultChecked: false, disabled: true },
          { label: 'VMSS Query', name: 'vmssQuery', defaultChecked: false, disabled: true },
          {
            label: 'Pricing Analysis',
            name: 'pricingAnalysis',
            defaultChecked: true,
            disabled: false,
          },
          {
            label: 'Website Structure',
            name: 'websiteStructure',
            defaultChecked: true,
            disabled: false,
          },
          {
            label: 'Transactions Analysis',
            name: 'transactionsAnalysis',
            defaultChecked: false,
            disabled: true,
          },
        ],
      },
      {
        label: "Website's Company Analysis",
        options: [
          {
            label: 'Line of Business Extraction',
            name: 'lineOfBusinessExtraction',
            defaultChecked: true,
            disabled: false,
          },
          {
            label: 'Scam and Fraud Indicators',
            name: 'scamAndFraudIndicators',
            defaultChecked: true,
            disabled: false,
          },
        ],
      },
      {
        label: 'Ads and Social Media Analysis',
        options: [
          {
            label: 'Social Media Presence',
            name: 'socialMediaPresence',
            defaultChecked: true,
            disabled: false,
          },
          {
            label: 'Related Ads Extractions',
            name: 'relatedAdsExtractions',
            defaultChecked: true,
            disabled: false,
          },
          {
            label: 'Violations Detection',
            name: 'violationsDetection',
            defaultChecked: true,
            disabled: false,
          },
        ],
      },
      {
        label: 'Payment Environment Analysis',
        options: [
          {
            label: 'Payment Gateways Extraction',
            name: 'paymentGatewaysExtraction',
            defaultChecked: false,
            disabled: true,
          },
          {
            label: 'Payment Environment Risk',
            name: 'paymentEnvironmentRisk',
            defaultChecked: false,
            disabled: true,
          },
        ],
      },
    ],
    [],
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
    checksConfiguration,
    riskLabels,
    industries,
    isLoadingCustomer,
  };
};
