import { Prisma, PrismaClient } from '@prisma/client';

const legacyKycSdkStepIdByLegacy = {
  'address-proof-check': 'check-address-proof',
} as const;

export const KYC_SL_WORKFLOW_DEFINITION_IDS = [
  'kyc_onboarding_sierra_leone',
  'kyb_onboarding_sierra_leone_formal',
  'kyb_onboarding_sierra_leone_informal',
  'loan_kyc_kyb_sierra_leone',
] as const;

const normalizeKycSdkStepId = (value: unknown): { value: unknown; changed: boolean } => {
  if (typeof value !== 'string') {
    return { value, changed: false };
  }

  const normalized = legacyKycSdkStepIdByLegacy[value as keyof typeof legacyKycSdkStepIdByLegacy];
  if (!normalized) {
    return { value, changed: false };
  }

  return { value: normalized, changed: true };
};

const normalizeKycSdkSteps = (steps: unknown): { value: unknown; changed: boolean } => {
  if (!Array.isArray(steps)) {
    return { value: steps, changed: false };
  }

  let changed = false;
  const normalized = steps.map(step => {
    const result = normalizeKycSdkStepId(step);
    if (result.changed) {
      changed = true;
    }
    return result.value;
  });

  return { value: normalized, changed };
};

const normalizeKycSdkConfig = (
  config: Prisma.JsonValue | null,
): {
  value: Prisma.JsonValue | null;
  changed: boolean;
} => {
  if (!config || Array.isArray(config) || typeof config !== 'object') {
    return { value: config, changed: false };
  }

  if (!Object.prototype.hasOwnProperty.call(config, 'kycSdkSteps')) {
    return { value: config, changed: false };
  }

  const result = normalizeKycSdkSteps((config as { kycSdkSteps?: unknown }).kycSdkSteps);
  if (!result.changed) {
    return { value: config, changed: false };
  }

  return {
    value: {
      ...(config as { [key: string]: unknown }),
      kycSdkSteps: result.value as string[],
    },
    changed: true,
  };
};

export const normalizeLegacyKycSdkSteps = async (
  client: PrismaClient,
  workflowDefinitionIds: string[] = [...KYC_SL_WORKFLOW_DEFINITION_IDS],
) => {
  const definitions = await client.workflowDefinition.findMany({
    where: { id: { in: workflowDefinitionIds } },
    select: { id: true, config: true },
  });

  let workflowDefinitionsUpdated = 0;

  for (const definition of definitions) {
    const normalized = normalizeKycSdkConfig(definition.config as Prisma.JsonValue | null);
    if (!normalized.changed) {
      continue;
    }

    await client.workflowDefinition.update({
      where: { id: definition.id },
      data: { config: normalized.value as unknown as Prisma.InputJsonValue },
    });
    workflowDefinitionsUpdated += 1;
  }

  const workflowRuntimeDataRecords = await client.workflowRuntimeData.findMany({
    where: {
      workflowDefinitionId: { in: workflowDefinitionIds },
      deletedAt: null,
      config: {
        not: Prisma.DbNull,
      },
    },
    select: { id: true, config: true },
  });

  let workflowRuntimeDataUpdated = 0;

  for (const runtime of workflowRuntimeDataRecords) {
    const normalized = normalizeKycSdkConfig(runtime.config as Prisma.JsonValue | null);
    if (!normalized.changed) {
      continue;
    }

    await client.workflowRuntimeData.update({
      where: { id: runtime.id },
      data: { config: normalized.value as Prisma.InputJsonValue },
    });
    workflowRuntimeDataUpdated += 1;
  }

  return {
    workflowDefinitionsUpdated,
    workflowRuntimeDataUpdated,
  };
};
