import type { LucideIcon } from 'lucide-react';

export type CheckStatus = 'positive' | 'neutral' | 'negative';

export type CheckItem = {
  displayName: string;
  status: CheckStatus;
  note: string;
};

export type AssessmentPageSection = {
  id: string;
  title: string;
  Component: JSX.Element;
  description?: string;
  Icon?: LucideIcon;
  label?: string;
  hasViolations?: boolean;
  condition?: () => boolean;
};

export interface NormalizedAddress {
  country: string;
  state: string;
  city: string;
  street: string;
  number: string;
  postalCode: string;
}

export interface Assessment {
  id: string;
  companyRegistryInformation?: {
    status: string;
    output?: {
      data?: any;
    };
  };
  companySanctions?: {
    status: string;
    output?: {
      data?: any[];
    };
  };
  companyStructure?: {
    status: string;
    output?: {
      nodes?: any[];
      edges?: any[];
    };
  };
  input?: {
    country?: string;
  };
}

export interface SanctionsData {
  sources?: any;
  officialLists?: any;
  fullReport: any;
  linkedIndividuals?: any;
  lastReviewed?: any;
  primaryName?: string;
  labels?: any;
  reasonsForMatch?: any;
  furtherInformation?: any;
  alternativeNames?: any;
  places?: any;
}

export interface SectionDataProps {
  assessment: Assessment | undefined;
  assessmentChecks: CheckItem[];
  companySanctionsBlock: any[];
  companyStructureBlock: any[];
  registryInfoBlock: any[];
}