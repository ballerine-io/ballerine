import { useMemo } from 'react';
import { Assessment, CheckItem } from '../types';

const includesAny = (text: string, values: string[]) => values.some(value => text.includes(value));

/**
 * Generates check items based on assessment data
 * Status mapping:
 * - positive (green): Verified, Extracted, or Clear - successful extraction/validation with no issues
 * - neutral (gray): Unverified - when checks can't be performed due to limitations but no red flags
 * - negative (red): Flagged, Issues - when risks or issues are confirmed
 */
export const getChecks = (assessment: Assessment | undefined): CheckItem[] => {
  if (!assessment) {
    return [];
  }

  const createCheck = (
    displayName: string,
    condition: boolean | null | undefined,
    positiveNote = 'Verified',
    negativeNote = 'Flagged',
    neutralNote = 'Unverified',
  ): CheckItem => {
    return {
      displayName,
      status: condition === true ? 'positive' : condition === false ? 'negative' : 'neutral',
      note: condition === true ? positiveNote : condition === false ? negativeNote : neutralNote,
    };
  };

  const hasRegistryData = Boolean(
    assessment?.companyRegistryInformation?.status === 'completed' &&
      assessment?.companyRegistryInformation?.output?.data,
  );

  const registryData = assessment?.companyRegistryInformation?.output?.data;

  const checks: CheckItem[] = [];

  // 1. Registry Information check
  checks.push(
    createCheck(
      'Registry Information',
      assessment?.companyRegistryInformation
        ? assessment.companyRegistryInformation.status === 'completed' && Boolean(registryData)
        : null,
      'Extracted',
      'Flagged',
    ),
  );

  // 2. Company Structure check
  const hasStructureData = Boolean(
    assessment?.companyStructure?.status === 'completed' &&
      (assessment?.companyStructure?.output?.nodes?.length ||
        assessment?.companyStructure?.output?.edges?.length),
  );

  checks.push(
    createCheck(
      'Company Structure',
      assessment?.companyStructure ? hasStructureData : null,
      'Extracted',
    ),
  );

  // 3. Active Company check
  if (registryData?.status?.normalized) {
    const companyStatus = String(registryData.status.normalized).toLowerCase();
    const isActive =
      includesAny(companyStatus, ['active', 'live']) &&
      !includesAny(companyStatus, ['inactive', 'dissolved', 'revoked']);

    checks.push(createCheck('Active Company', isActive));
  } else if (hasRegistryData) {
    checks.push(createCheck('Active Company', null));
  }

  // 4. Company Sanctions check
  if (assessment?.companySanctions) {
    const sanctionsStatus = assessment.companySanctions.status === 'completed';
    const hasSanctions = Boolean(assessment.companySanctions.output?.data?.length);

    checks.push(
      createCheck('Company Sanctions', sanctionsStatus ? !hasSanctions : null, 'Clear', 'Flagged'),
    );
  } else {
    checks.push(createCheck('Company Sanctions', null));
  }

  // 5. Incorporation date check
  if (registryData?.foundationDate?.normalized) {
    try {
      const foundationDate = new Date(registryData.foundationDate.normalized);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      checks.push(createCheck('Incorporated > 1 Year', foundationDate < oneYearAgo));
    } catch (e) {
      checks.push(createCheck('Incorporated > 1 Year', null));
    }
  } else if (hasRegistryData) {
    checks.push(createCheck('Incorporated > 1 Year', null));
  }

  // 6. Registered Address check
  if (registryData?.addresses?.length) {
    const hasRegisteredAddress = registryData.addresses.some((addr: any) => {
      if (addr.type) {
        return addr.type.toLowerCase().includes('registered') && addr.fullAddress;
      }

      return !!addr.fullAddress;
    });

    checks.push(createCheck('Registered Address', hasRegisteredAddress, 'Extracted'));
  } else if (hasRegistryData) {
    checks.push(createCheck('Registered Address', null));
  }

  // comment for dummy commit

  // 7. Company Jurisdiction check
  if (registryData?.incorporationJurisdiction?.original) {
    // High-risk jurisdictions
    // FIXME: In a real implementation, this would be from a configuration
    const highRiskJurisdictions = ['RU', 'BY', 'IR', 'KP', 'SY', 'CU', 'VE'];
    const jurisdiction = String(registryData.incorporationJurisdiction.original);
    const isHighRisk = highRiskJurisdictions.includes(jurisdiction);

    checks.push(createCheck('Company Jurisdiction', !isHighRisk, 'Clear', 'High Risk'));
  } else if (hasRegistryData) {
    checks.push(createCheck('Company Jurisdiction', null));
  }

  return checks;
};

export type WarningFlag = {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'error';
};

export const getWarningFlags = (assessment: Assessment | undefined): WarningFlag[] => {
  if (!assessment) {
    return [];
  }

  const flags: WarningFlag[] = [];

  const geographyInfo = assessment.input?.countryOfIncorporation || assessment.input?.country;
  const registryStatus = assessment.companyRegistryInformation?.status;
  const registryError = assessment.companyRegistryInformation?.error;

  if (registryStatus === 'failed' || registryError) {
    if (registryError?.includes('not supported') || registryError?.includes('unsupported')) {
      flags.push({
        id: 'registry-not-supported',
        title: 'Registry Information Not Supported',
        description: `Company registry information is not supported for ${
          geographyInfo || 'the provided geography'
        }.`,
        severity: 'warning',
      });
    } else if (registryError?.includes('not found') || registryError?.includes('does not exist')) {
      flags.push({
        id: 'company-not-exist',
        title: 'Company Does Not Exist in Registry',
        description: 'The company could not be found in the registry database.',
        severity: 'error',
      });
    } else {
      flags.push({
        id: 'registry-not-available',
        title: 'Registry Information Not Available',
        description: 'Registry information is temporarily unavailable.',
        severity: 'info',
      });
    }
  }

  const structureStatus = assessment.companyStructure?.status;
  const structureError = assessment.companyStructure?.error;

  if (structureStatus === 'failed' || structureError) {
    if (structureError?.includes('not supported') || structureError?.includes('unsupported')) {
      flags.push({
        id: 'ownership-not-supported',
        title: 'Ownership Information Not Supported',
        description: `Ownership information is not supported for ${
          geographyInfo || 'the provided geography'
        }.`,
        severity: 'warning',
      });
    } else {
      flags.push({
        id: 'ownership-not-available',
        title: 'Ownership Information Not Available',
        description: 'Ownership information is temporarily unavailable.',
        severity: 'info',
      });
    }
  }

  const registryData = assessment.companyRegistryInformation?.output?.data;
  if (registryData?.incorporationJurisdiction?.original) {
    const highRiskJurisdictions = ['RU', 'BY', 'IR', 'KP', 'SY', 'CU', 'VE'];
    const jurisdiction = String(registryData.incorporationJurisdiction.original);

    if (highRiskJurisdictions.includes(jurisdiction)) {
      flags.push({
        id: 'high-risk-jurisdiction',
        title: 'High Risk Company Jurisdiction',
        description: `The company is registered in ${jurisdiction}, which is considered a high-risk jurisdiction.`,
        severity: 'error',
      });
    }
  }

  return flags;
};

export const useAssessmentChecks = (assessment: Assessment | undefined): CheckItem[] => {
  return useMemo(() => getChecks(assessment), [assessment]);
};

export const useAssessmentWarningFlags = (assessment: Assessment | undefined): WarningFlag[] => {
  return useMemo(() => getWarningFlags(assessment), [assessment]);
};
