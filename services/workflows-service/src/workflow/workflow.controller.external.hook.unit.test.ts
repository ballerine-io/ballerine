import { WorkflowControllerExternal } from './workflow.controller.external';
import { Prisma } from '@prisma/client';

describe('WorkflowControllerExternal.hook', () => {
  const baseParams = { id: 'runtime-id', event: 'verification-result' };

  it('treats missing workflow runtime as no-op', async () => {
    const prismaService = {
      $transaction: jest.fn().mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: 'test',
        }),
      ),
    };

    const controller = new WorkflowControllerExternal(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      prismaService as never,
      {} as never,
    );

    await expect(controller.hook(baseParams, {}, {})).resolves.toBeUndefined();
  });

  it('rethrows non-record-not-found errors', async () => {
    const prismaService = {
      $transaction: jest.fn().mockRejectedValue(new Error('boom')),
    };

    const controller = new WorkflowControllerExternal(
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      prismaService as never,
      {} as never,
    );

    await expect(controller.hook(baseParams, {}, {})).rejects.toThrow('boom');
  });
});
