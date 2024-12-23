import { AlertService } from '@/alert/alert.service';
import { AlertDefinition } from '@prisma/client';
import { createTransactionRecord } from './create-transaction-record';
import { InlineRule } from '@/data-analytics/types';

export const createAlert = async (
  projectId: string,
  alertDefinition: AlertDefinition,
  alertService: AlertService,
  transactions: Awaited<ReturnType<typeof createTransactionRecord>>,
) => {
  const subject = (alertDefinition.inlineRule as InlineRule).subjects[0] as
    | 'counterpartyBeneficiaryId'
    | 'counterpartyOriginatorId';

  const subjectValue = transactions[0]?.[subject];

  // Accessing private method for testing purposes while maintaining types
  return await alertService.createAlert(
    {
      ...alertDefinition,
      projectId,
    },
    [{ [subject]: subjectValue }],
    {},
    {},
  );
};
