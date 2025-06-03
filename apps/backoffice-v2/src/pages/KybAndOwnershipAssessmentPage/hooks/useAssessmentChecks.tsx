import { useMemo } from 'react';
import { Assessment, CheckItem } from '../types';

/**
 * Generates check items based on assessment data
 * Status mapping:
 * - positive (green): Verified, Extracted, or Clear - successful extraction/validation with no issues
 * - neutral (gray): Unverified - when checks can't be performed due to limitations but no red flags
 * - negative (red): Flagged, Issues - when risks or issues are confirmed
 */
export const getChecks = (assessment: Assessment | undefined): CheckItem[] => {
  if (!assessment) return [];

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
      companyStatus.includes('active') ||
      companyStatus.includes('live') ||
      (!companyStatus.includes('inactive') &&
        !companyStatus.includes('dissolved') &&
        !companyStatus.includes('revoked'));

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

export const useAssessmentChecks = (assessment: Assessment | undefined): CheckItem[] => {
  return useMemo(() => getChecks(assessment), [assessment]);
};
