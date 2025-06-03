import { industries } from './industries';

export const BUSINESS_TYPE_OPTIONS = [
  {
    label: 'text.companyDetails.businessType.options.empty',
    value: undefined,
  },
  {
    label: 'text.companyDetails.businessType.options.limited',
    value: 'Limited',
  },
  {
    label: 'text.companyDetails.businessType.options.public_limited',
    value: 'Public Limited',
  },
  {
    label: 'text.companyDetails.businessType.options.limited_liability_partnership',
    value: 'Limited Liability Partnership',
  },
  {
    label: 'text.companyDetails.businessType.options.goverment_or_local_authority',
    value: 'Government/Local Authority',
  },
  {
    label: 'text.companyDetails.businessType.options.sole_trader',
    value: 'Sole Trader',
  },
  {
    label: 'text.companyDetails.businessType.options.partnership',
    value: 'Partnership',
  },
  {
    label: 'text.companyDetails.businessType.options.other',
    value: 'Other',
  },
  {
    label: 'text.companyDetails.businessType.options.sole_proprietorship',
    value: 'Sole Proprietorship',
  },
  {
    label: 'text.companyDetails.businessType.options.corporation',
    value: 'Corporation',
  },
  {
    label: 'text.companyDetails.businessType.options.non_profit_organization',
    value: 'Non-profit',
  },
  {
    label: 'text.companyDetails.businessType.options.publicly_traded_company',
    value: 'Publicly Traded',
  },
];

export const TAX_ID_TYPE_OPTIONS = [
  { label: 'ABN', value: 'ABN' },
  { label: 'BID', value: 'BID' },
  { label: 'BN', value: 'BN' },
  { label: 'BRNO', value: 'BRNO' },
  { label: 'CL', value: 'CL' },
  { label: 'CLN', value: 'CLN' },
  { label: 'CNPJ', value: 'CNPJ' },
  { label: 'CR', value: 'CR' },
  { label: 'CUIT', value: 'CUIT' },
  { label: 'EDRPOU', value: 'EDRPOU' },
  { label: 'EIN', value: 'EIN' },
  { label: 'HKBR', value: 'HKBR' },
  { label: 'NATIONAL ID', value: 'NATIONAL ID' },
  { label: 'NZBN', value: 'NZBN' },
  { label: 'PAN', value: 'PAN' },
  { label: 'RFC', value: 'RFC' },
  { label: 'RNC', value: 'RNC' },
  { label: 'RUC', value: 'RUC' },
  { label: 'RUT', value: 'RUT' },
  { label: 'SIN', value: 'SIN' },
  { label: 'SSN', value: 'SSN' },
  { label: 'UEN', value: 'UEN' },
  { label: 'VAT', value: 'VAT' },
  { label: 'n/a', value: 'N/A' },
];

export const INDUSTRIES_OPTIONS = industries.map(industry => ({
  label: `${industry.industry}`,
  mccCode: industry.mcc_code,
  value: industry.industry,
}));

export const MCC_OPTIONS = industries.map(industry => ({
  label: `${industry.mcc_code} - ${industry.industry}`,
  industry: industry.industry,
  value: industry.mcc_code,
}));

export const CHARGING_MODEL_OPTIONS = [
  {
    label: 'text.companyActivity.chargingModel.options.one_of',
    value: 'One-of',
  },
  {
    label: 'text.companyActivity.chargingModel.options.recurring',
    value: 'Recurring',
  },
  { label: 'text.companyActivity.chargingModel.options.other', value: 'other' },
];

export const FULLFILLMENT_PERIOD_OPTIONS = [
  {
    label: 'text.processingDetails.averageFullfilmentPeriod.options.empty',
    value: undefined,
  },
  {
    label: 'text.processingDetails.averageFullfilmentPeriod.options.no_delay',
    value: 'text.processingDetails.averageFullfilmentPeriod.options.no_delay',
  },
  {
    label: 'text.processingDetails.averageFullfilmentPeriod.options.up_to_7_days',
    value: 'text.processingDetails.averageFullfilmentPeriod.options.up_to_7_days',
  },
  {
    label: 'text.processingDetails.averageFullfilmentPeriod.options.between_7_and_20_days',
    value: 'text.processingDetails.averageFullfilmentPeriod.options.between_7_and_20_days',
  },
  {
    label: 'text.processingDetails.averageFullfilmentPeriod.options.more_than_20_days',
    value: 'text.processingDetails.averageFullfilmentPeriod.options.more_than_20_days',
  },
];

export const AVERAGE_REFUND_AMOUNT_RATIO_OPTIONS = [
  {
    label: 'text.processingDetails.averageRefundAmountRatio.options.empty',
    value: undefined,
  },
  {
    label: 'text.processingDetails.averageRefundAmountRatio.options.under_3_percent',
    value: 'text.processingDetails.averageRefundAmountRatio.options.under_3_percent',
  },
  {
    label: 'text.processingDetails.averageRefundAmountRatio.options.between_3_and_10_percent',
    value: 'text.processingDetails.averageRefundAmountRatio.options.between_3_and_10_percent',
  },
  {
    label: 'text.processingDetails.averageRefundAmountRatio.options.between_5_and_10_percent',
    value: 'text.processingDetails.averageRefundAmountRatio.options.between_5_and_10_percent',
  },
  {
    label: 'text.processingDetails.averageRefundAmountRatio.options.above_10_percent',
    value: 'text.processingDetails.averageRefundAmountRatio.options.above_10_percent',
  },
];

export const AVERAGE_CHARGEBACK_AMOUNT_RATIO_OPTIONS = [
  {
    label: 'text.processingDetails.averageChargebackAmountRatio.options.empty',
    value: undefined,
  },
  {
    label: 'text.processingDetails.averageChargebackAmountRatio.options.under_0_5_percent',
    value: 'text.processingDetails.averageChargebackAmountRatio.options.under_0_5_percent',
  },
  {
    label: 'text.processingDetails.averageChargebackAmountRatio.options.between_0_5_and_1_percent',
    value: 'text.processingDetails.averageChargebackAmountRatio.options.between_0_5_and_1_percent',
  },
  {
    label: 'text.processingDetails.averageChargebackAmountRatio.options.between_1_and_2_percent',
    value: 'text.processingDetails.averageChargebackAmountRatio.options.between_1_and_2_percent',
  },
  {
    label: 'text.processingDetails.averageChargebackAmountRatio.options.between_2_and_5_percent',
    value: 'text.processingDetails.averageChargebackAmountRatio.options.between_2_and_5_percent',
  },
  {
    label: 'text.processingDetails.averageChargebackAmountRatio.options.above_5_percent',
    value: 'text.processingDetails.averageChargebackAmountRatio.options.above_5_percent',
  },
];

export const UBO_ORGANIZATION_ROLE_OPTIONS = [
  {
    label: 'text.companyOwnership.ubo.organizationRole.options.empty',
    value: undefined,
  },
  {
    label: 'text.companyOwnership.ubo.organizationRole.options.shareholder',
    value: 'text.companyOwnership.ubo.organizationRole.options.shareholder',
  },
  {
    label: 'text.companyOwnership.ubo.organizationRole.options.director',
    value: 'text.companyOwnership.ubo.organizationRole.options.director',
  },
  {
    label: 'text.companyOwnership.ubo.organizationRole.options.ubo',
    value: 'text.companyOwnership.ubo.organizationRole.options.ubo',
  },
  {
    label: 'text.companyOwnership.ubo.organizationRole.options.director_and_owner',
    value: 'text.companyOwnership.ubo.organizationRole.options.director_and_owner',
  },
  {
    label: 'text.companyOwnership.ubo.organizationRole.options.regular',
    value: 'text.companyOwnership.ubo.organizationRole.options.regular',
  },
];

export const DIRECTOR_ORGANIZATION_ROLE_OPTIONS = [
  {
    label: 'text.companyOwnership.directors.organizationRole.options.empty',
    value: undefined,
  },
  {
    label: 'text.companyOwnership.directors.organizationRole.options.shareholder',
    value: 'text.companyOwnership.directors.organizationRole.options.shareholder',
  },
  {
    label: 'text.companyOwnership.directors.organizationRole.options.director',
    value: 'text.companyOwnership.directors.organizationRole.options.director',
  },
  {
    label: 'text.companyOwnership.directors.organizationRole.options.ubo',
    value: 'text.companyOwnership.directors.organizationRole.options.ubo',
  },
  {
    label: 'text.companyOwnership.directors.organizationRole.options.director_and_owner',
    value: 'text.companyOwnership.directors.organizationRole.options.director_and_owner',
  },
  {
    label: 'text.companyOwnership.directors.organizationRole.options.regular',
    value: 'text.companyOwnership.directors.organizationRole.options.regular',
  },
];
