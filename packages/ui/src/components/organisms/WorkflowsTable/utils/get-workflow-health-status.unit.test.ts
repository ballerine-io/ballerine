import { describe, expect, test } from 'vitest';
import { WorkflowTableItem } from '../types';
import { getWorkflowHealthStatus } from '../utils/get-workflow-health-status';
import dayjs from 'dayjs';
import { WorkflowHealthStatus } from '@/common/enums';

describe('getWorkflowHealthStatus', () => {
  describe('healthy status', () => {
    test('healthy when status is completed', () => {
      expect(getWorkflowHealthStatus({ status: 'completed' } as WorkflowTableItem)).toBe(
        WorkflowHealthStatus.healthy,
      );
    });

    test('healthy when status pending/active and process started  < 2 hours ago', () => {
      const PAST_DATE_3O_MIN_AGO = dayjs().subtract(30, 'minutes');

      expect(
        getWorkflowHealthStatus({
          status: 'active',
          createdAt: PAST_DATE_3O_MIN_AGO.toDate(),
        } as WorkflowTableItem),
      ).toBe(WorkflowHealthStatus.healthy);
    });
  });

  describe('pending status', () => {
    test('pending when status pending/active and process started > 2 && < 6 hours', () => {
      const PAST_DATE_3HOURS_AGO = dayjs().subtract(3, 'hours');

      expect(
        getWorkflowHealthStatus({
          status: 'active',
          createdAt: PAST_DATE_3HOURS_AGO.toDate(),
        } as WorkflowTableItem),
      ).toBe(WorkflowHealthStatus.pending);
    });
  });

  describe('pending-longterm status', () => {
    test('pending-longterm when status pending/active and process started > 6 hours', () => {
      const PAST_DATE_8HOURS_AGO = dayjs().subtract(8, 'hours');

      expect(
        getWorkflowHealthStatus({
          status: 'active',
          createdAt: PAST_DATE_8HOURS_AGO.toDate(),
        } as WorkflowTableItem),
      ).toBe(WorkflowHealthStatus['pending-longterm']);
    });
  });
});
