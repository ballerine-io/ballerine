import { TWorkflowById } from '@/domains/workflows/fetchers';

export const associatedCompanyAdapter = (workflow: TWorkflowById) => ({
  workflowId: workflow?.id,
  companyName: workflow?.context?.entity?.data?.companyName,
  registrationNumber: workflow?.context?.entity?.data?.registrationNumber,
  registeredCountry: workflow?.context?.entity?.data?.country,
  relationship: workflow?.context?.entity?.data?.additionalInfo?.associationRelationship,
  contactPerson: `${
    workflow?.context?.entity?.data?.additionalInfo?.mainRepresentative?.firstName ?? ''
  }${
    workflow?.context?.entity?.data?.additionalInfo?.mainRepresentative?.lastName
      ? ` ${workflow?.context?.entity?.data?.additionalInfo?.mainRepresentative?.lastName}`
      : ''
  }`,
  contactEmail: workflow?.context?.entity?.data?.additionalInfo?.mainRepresentative?.email,
  nextEvents: workflow?.nextEvents,
  tags: workflow?.tags,
  collectionFlowUrl: `${workflow?.context?.metadata?.collectionFlowUrl}/?token=${workflow?.context?.metadata?.token}`,
});
