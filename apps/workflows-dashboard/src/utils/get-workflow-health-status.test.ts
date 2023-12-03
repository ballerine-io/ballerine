import dayjs from 'dayjs';
import { IWorkflow } from '@/domains/workflows/api/workflow';
import { getWorkflowHealthStatus, HealthStatus } from '@/utils/get-workflow-health-status';

describe('getWorkflowHealthStatus', () => {
  describe('healthy status', () => {
    test('healthy when status is completed', () => {
      expect(getWorkflowHealthStatus({ status: 'completed' } as IWorkflow)).toBe(
        HealthStatus.healthy,
      );
    });

    test('healthy when status pending/active and process started  < 2 hours ago', () => {
      const PAST_DATE_3O_MIN_AGO = dayjs().subtract(30, 'minutes');

      expect(
        getWorkflowHealthStatus({
          status: 'active',
          createdAt: PAST_DATE_3O_MIN_AGO.toDate(),
        } as IWorkflow),
      ).toBe(HealthStatus.healthy);
    });
  });

  describe('pending status', () => {
    test('pending when status pending/active and process started > 2 && < 6 hours', () => {
      const PAST_DATE_3HOURS_AGO = dayjs().subtract(3, 'hours');

      expect(
        getWorkflowHealthStatus({
          status: 'active',
          createdAt: PAST_DATE_3HOURS_AGO.toDate(),
        } as IWorkflow),
      ).toBe(HealthStatus.pending);
    });
  });

  describe('pending-longterm status', () => {
    test('pending-longterm when status pending/active and process started > 6 hours', () => {
      const PAST_DATE_8HOURS_AGO = dayjs().subtract(8, 'hours');

      expect(
        getWorkflowHealthStatus({
          status: 'active',
          createdAt: PAST_DATE_8HOURS_AGO.toDate(),
        } as IWorkflow),
      ).toBe(HealthStatus['pending-longterm']);
    });
  });
});
