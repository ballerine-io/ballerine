import { TCustomerSubscription } from '@/customer/schemas/zod-schemas';
import { mergeSubscriptions } from './get-webhooks';

jest.mock('crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('mocked-uuid'),
}));

describe('Webhook Functions', () => {
  describe('mergeSubscriptions', () => {
    it('should return customer subscriptions when workflow subscriptions are empty', () => {
      // Arrange
      const customerSubs = [{ type: 'webhook' as const, events: ['event1'], url: 'url1' }];
      const workflowSubs: Array<TCustomerSubscription['subscriptions'][number]> = [];

      // Act
      const result = mergeSubscriptions(customerSubs, workflowSubs);

      // Assert
      expect(result).toEqual(customerSubs);
    });
    it('should return workflow subscriptions when customer subscriptions are empty', () => {
      // Arrange
      const customerSubs: Array<TCustomerSubscription['subscriptions'][number]> = [];
      const workflowSubs = [{ type: 'webhook' as const, events: ['event1'], url: 'url1' }];

      // Act
      const result = mergeSubscriptions(customerSubs, workflowSubs);

      // Assert
      expect(result).toEqual(workflowSubs);
    });

    it('should override customer subscriptions with workflow subscriptions for matching events', () => {
      // Arrange
      const customerSubs = [
        {
          type: 'webhook' as const,
          events: ['workflow.completed', 'workflow.started'],
          url: 'customer-url1',
        },
        { type: 'webhook' as const, events: ['workflow.completed'], url: 'customer-url2' },
      ];
      const workflowSubs = [
        { type: 'webhook' as const, events: ['workflow.completed'], url: 'workflow-url1' },
      ];

      // Act
      const result = mergeSubscriptions(customerSubs, workflowSubs);

      // Assert
      expect(result).toEqual([
        { type: 'webhook', events: ['workflow.started'], url: 'customer-url1' },
        { type: 'webhook', events: ['workflow.completed'], url: 'workflow-url1' },
      ]);
    });

    it('should override customer subscriptions with workflow subscriptions for matching events regardless of type', () => {
      // Arrange
      const customerSubs = [
        { type: 'email' as const, events: ['workflow.completed'], url: 'customer-email' },
        { type: 'webhook' as const, events: ['workflow.completed'], url: 'customer-url' },
      ];
      const workflowSubs = [
        { type: 'webhook' as const, events: ['workflow.completed'], url: 'workflow-url' },
        { type: 'email' as const, events: ['workflow.completed'], url: 'workflow-email' },
      ];

      // Act
      const result = mergeSubscriptions(customerSubs, workflowSubs);

      // Assert
      expect(result).toEqual([
        { type: 'webhook', events: ['workflow.completed'], url: 'workflow-url' },
        { type: 'email', events: ['workflow.completed'], url: 'workflow-email' },
      ]);
    });

    it('should handle multiple events in workflow subscriptions', () => {
      // Arrange
      const customerSubs = [
        { type: 'webhook' as const, events: ['event1', 'event2', 'event3'], url: 'customer-url1' },
        { type: 'webhook' as const, events: ['event2', 'event4'], url: 'customer-url2' },
      ];
      const workflowSubs = [
        { type: 'webhook' as const, events: ['event1', 'event2'], url: 'workflow-url' },
      ];

      // Act
      const result = mergeSubscriptions(customerSubs, workflowSubs);

      // Assert
      expect(result).toEqual([
        { type: 'webhook', events: ['event3'], url: 'customer-url1' },
        { type: 'webhook', events: ['event4'], url: 'customer-url2' },
        { type: 'webhook', events: ['event1', 'event2'], url: 'workflow-url' },
      ]);
    });

    it('should remove customer subscriptions entirely if all their events are overridden', () => {
      // Arrange
      const customerSubs = [
        { type: 'webhook' as const, events: ['event1', 'event2'], url: 'customer-url' },
      ];
      const workflowSubs = [
        { type: 'webhook' as const, events: ['event1', 'event2'], url: 'workflow-url' },
      ];

      // Act
      const result = mergeSubscriptions(customerSubs, workflowSubs);

      // Assert
      expect(result).toEqual([
        { type: 'webhook', events: ['event1', 'event2'], url: 'workflow-url' },
      ]);
    });

    it('should handle empty arrays for both customer and workflow subscriptions', () => {
      // Arrange
      const customerSubs: Array<TCustomerSubscription['subscriptions'][number]> = [];
      const workflowSubs: Array<TCustomerSubscription['subscriptions'][number]> = [];

      // Act
      const result = mergeSubscriptions(customerSubs, workflowSubs);

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle undefined customer subscriptions', () => {
      // Arrange
      const customerSubs = undefined;
      const workflowSubs = [{ type: 'webhook' as const, events: ['event1'], url: 'workflow-url' }];

      // Act
      const result = mergeSubscriptions(
        customerSubs as unknown as Array<TCustomerSubscription['subscriptions'][number]>,
        workflowSubs,
      );

      // Assert
      expect(result).toEqual([{ type: 'webhook', events: ['event1'], url: 'workflow-url' }]);
    });

    it('should handle undefined workflow subscriptions', () => {
      // Arrange
      const customerSubs = [{ type: 'webhook' as const, events: ['event1'], url: 'customer-url' }];
      const workflowSubs = undefined;

      // Act
      const result = mergeSubscriptions(
        customerSubs as unknown as Array<TCustomerSubscription['subscriptions'][number]>,
        workflowSubs as unknown as Array<TCustomerSubscription['subscriptions'][number]>,
      );

      // Assert
      expect(result).toEqual([{ type: 'webhook', events: ['event1'], url: 'customer-url' }]);
    });

    it('should handle empty events arrays', () => {
      // Arrange
      const customerSubs = [{ type: 'webhook' as const, events: [], url: 'customer-url' }];
      const workflowSubs = [{ type: 'webhook' as const, events: [], url: 'workflow-url' }];

      // Act
      const result = mergeSubscriptions(customerSubs, workflowSubs);

      // Assert
      expect(result).toEqual([
        { type: 'webhook', events: [], url: 'customer-url' },
        { type: 'webhook', events: [], url: 'workflow-url' },
      ]);
    });

    it('should handle duplicate events in workflow subscriptions', () => {
      // Arrange
      const customerSubs = [
        { type: 'webhook' as const, events: ['event1', 'event2'], url: 'customer-url' },
      ];
      const workflowSubs = [
        { type: 'webhook' as const, events: ['event1', 'event1'], url: 'workflow-url' },
      ];

      // Act
      const result = mergeSubscriptions(customerSubs, workflowSubs);

      // Assert
      expect(result).toEqual([
        { type: 'webhook', events: ['event2'], url: 'customer-url' },
        { type: 'webhook', events: ['event1', 'event1'], url: 'workflow-url' },
      ]);
    });
  });
});
