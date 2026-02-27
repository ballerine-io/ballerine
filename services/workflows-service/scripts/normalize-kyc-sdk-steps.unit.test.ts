import { Prisma, PrismaClient } from '@prisma/client';

import {
  normalizeLegacyKycSdkSteps,
  KYC_SL_WORKFLOW_DEFINITION_IDS,
} from './normalize-kyc-sdk-steps';

type MockWorkflowDataClient = {
  findMany: jest.Mock;
  update: jest.Mock;
};

type MockPrismaClient = {
  workflowDefinition: MockWorkflowDataClient;
  workflowRuntimeData: MockWorkflowDataClient;
};

const makeClient = (): MockPrismaClient => {
  return {
    workflowDefinition: {
      findMany: jest.fn(),
      update: jest.fn().mockResolvedValue({}),
    },
    workflowRuntimeData: {
      findMany: jest.fn(),
      update: jest.fn().mockResolvedValue({}),
    },
  };
};

const asPrismaClient = (client: MockPrismaClient): PrismaClient =>
  client as unknown as PrismaClient;

const legacyStep = 'address-proof-check';
const normalizedLegacyStep = 'check-address-proof';

describe('normalizeLegacyKycSdkSteps', () => {
  it('leaves null configs untouched', async () => {
    const client = makeClient();

    client.workflowDefinition.findMany.mockResolvedValue([{ id: 'definition-1', config: null }]);
    client.workflowRuntimeData.findMany.mockResolvedValue([{ id: 'runtime-1', config: null }]);

    const result = await normalizeLegacyKycSdkSteps(asPrismaClient(client), [
      'definition-1',
      'runtime-1',
    ]);

    expect(result).toEqual({
      workflowDefinitionsUpdated: 0,
      workflowRuntimeDataUpdated: 0,
    });
    expect(client.workflowDefinition.update).not.toHaveBeenCalled();
    expect(client.workflowRuntimeData.update).not.toHaveBeenCalled();
  });

  it('leaves non-object and array-shaped config untouched', async () => {
    const client = makeClient();

    client.workflowDefinition.findMany.mockResolvedValue([
      { id: 'definition-1', config: ['address-proof-check'] as unknown as Prisma.JsonValue },
      { id: 'definition-2', config: 'address-proof-check' as unknown as Prisma.JsonValue },
      { id: 'definition-3', config: {} as Prisma.JsonValue },
    ]);
    client.workflowRuntimeData.findMany.mockResolvedValue([]);

    const result = await normalizeLegacyKycSdkSteps(asPrismaClient(client), [
      'definition-1',
      'definition-2',
      'definition-3',
    ]);

    expect(result).toEqual({
      workflowDefinitionsUpdated: 0,
      workflowRuntimeDataUpdated: 0,
    });
    expect(client.workflowDefinition.update).not.toHaveBeenCalled();
  });

  it('normalizes known legacy step ids and preserves unexpected step strings', async () => {
    const client = makeClient();

    client.workflowDefinition.findMany.mockResolvedValue([
      {
        id: 'definition-1',
        config: {
          kycSdkSteps: [legacyStep, 'custom-kyc-step'],
          someOtherKey: 'value',
        } as Prisma.JsonValue,
      },
    ]);
    client.workflowRuntimeData.findMany.mockResolvedValue([
      { id: 'runtime-1', config: { kycSdkSteps: ['foo', legacyStep] } as Prisma.JsonValue },
    ]);

    const result = await normalizeLegacyKycSdkSteps(asPrismaClient(client), [
      'definition-1',
      'runtime-1',
    ]);

    expect(result).toEqual({
      workflowDefinitionsUpdated: 1,
      workflowRuntimeDataUpdated: 1,
    });
    expect(client.workflowDefinition.update).toHaveBeenCalledTimes(1);
    expect(client.workflowRuntimeData.update).toHaveBeenCalledTimes(1);
    expect(client.workflowDefinition.update).toHaveBeenCalledWith({
      where: { id: 'definition-1' },
      data: {
        config: {
          kycSdkSteps: [normalizedLegacyStep, 'custom-kyc-step'],
          someOtherKey: 'value',
        },
      },
    });
    expect(client.workflowRuntimeData.update).toHaveBeenCalledWith({
      where: { id: 'runtime-1' },
      data: {
        config: {
          kycSdkSteps: ['foo', normalizedLegacyStep],
        },
      },
    });
  });

  it('does not mutate configs that only contain unexpected kycSdkSteps values', async () => {
    const client = makeClient();
    const runtimeConfig = { kycSdkSteps: ['unexpected-step-a', 'unexpected-step-b'] };

    client.workflowDefinition.findMany.mockResolvedValue([
      { id: 'definition-1', config: runtimeConfig as Prisma.JsonValue },
    ]);
    client.workflowRuntimeData.findMany.mockResolvedValue([
      { id: 'runtime-1', config: runtimeConfig as Prisma.JsonValue },
    ]);

    const result = await normalizeLegacyKycSdkSteps(asPrismaClient(client), [
      'definition-1',
      'runtime-1',
    ]);

    expect(result).toEqual({
      workflowDefinitionsUpdated: 0,
      workflowRuntimeDataUpdated: 0,
    });
    expect(client.workflowDefinition.update).not.toHaveBeenCalled();
    expect(client.workflowRuntimeData.update).not.toHaveBeenCalled();
  });

  it('updates only selected workflow IDs and uses expected query filters', async () => {
    const client = makeClient();
    const ids: string[] = ['definition-1', 'definition-2'];

    client.workflowDefinition.findMany.mockResolvedValue([
      { id: 'definition-1', config: { kycSdkSteps: [legacyStep] } as Prisma.JsonValue },
      { id: 'definition-2', config: null },
    ]);
    client.workflowRuntimeData.findMany.mockResolvedValue([
      { id: 'runtime-1', config: null },
      { id: 'runtime-2', config: { kycSdkSteps: [legacyStep] } as Prisma.JsonValue },
    ]);

    const result = await normalizeLegacyKycSdkSteps(asPrismaClient(client), ids);

    expect(result).toEqual({
      workflowDefinitionsUpdated: 1,
      workflowRuntimeDataUpdated: 1,
    });
    expect(client.workflowDefinition.findMany).toHaveBeenCalledWith({
      where: { id: { in: ids } },
      select: { id: true, config: true },
    });
    expect(client.workflowRuntimeData.findMany).toHaveBeenCalledWith({
      where: {
        workflowDefinitionId: { in: ids },
        deletedAt: null,
        config: {
          not: Prisma.DbNull,
        },
      },
      select: { id: true, config: true },
    });
    expect(client.workflowDefinition.update).toHaveBeenCalledWith({
      where: { id: 'definition-1' },
      data: { config: { kycSdkSteps: [normalizedLegacyStep] } },
    });
    expect(client.workflowRuntimeData.update).toHaveBeenCalledWith({
      where: { id: 'runtime-2' },
      data: { config: { kycSdkSteps: [normalizedLegacyStep] } },
    });
  });

  it('defaults to SL workflow ids when no ids are provided', async () => {
    const client = makeClient();

    client.workflowDefinition.findMany.mockResolvedValue([]);
    client.workflowRuntimeData.findMany.mockResolvedValue([]);

    await normalizeLegacyKycSdkSteps(asPrismaClient(client));

    expect(client.workflowDefinition.findMany).toHaveBeenCalledWith({
      where: { id: { in: [...KYC_SL_WORKFLOW_DEFINITION_IDS] } },
      select: { id: true, config: true },
    });
    expect(client.workflowRuntimeData.findMany).toHaveBeenCalledWith({
      where: {
        workflowDefinitionId: { in: [...KYC_SL_WORKFLOW_DEFINITION_IDS] },
        deletedAt: null,
        config: {
          not: Prisma.DbNull,
        },
      },
      select: { id: true, config: true },
    });
  });
});
