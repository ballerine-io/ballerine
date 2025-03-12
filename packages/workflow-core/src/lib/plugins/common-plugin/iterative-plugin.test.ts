import { describe, expect, it, vi } from 'vitest';
import { IterativePlugin } from './iterative-plugin';
import { JmespathTransformer } from '../../utils/context-transformers/jmespath-transformer';

describe('IterativePlugin', () => {
  describe('filter functionality', () => {
    it('should filter based on a json-logic filter', async () => {
      const mockContext = {
        entity: {
          data: {
            additionalInfo: {
              directors: [
                { id: '1', name: 'Director 1', isAuthoritativeSignatory: true },
                { id: '2', name: 'Director 2', isAuthoritativeSignatory: false },
                { id: '3', name: 'Director 3', isAuthoritativeSignatory: true },
                { id: '4', name: 'Director 4', isAuthoritativeSignatory: false },
              ],
            },
          },
        },
      };

      const jmespathTransformer = new JmespathTransformer('entity.data.additionalInfo.directors');

      const iterativePlugin = new IterativePlugin({
        name: 'test_iterative_plugin',
        stateNames: ['test_state'],
        iterateOn: [jmespathTransformer],
        action: async context => {
          return { result: 'success' };
        },
        filter: [
          {
            strategy: 'json-logic',
            value: { '==': [{ var: 'isAuthoritativeSignatory' }, true] },
          },
        ],
        successAction: 'SUCCESS',
        errorAction: 'ERROR',
      });

      const filteredIterationParams = iterativePlugin.filterItems(
        mockContext.entity.data.additionalInfo.directors,
      );

      expect(filteredIterationParams).toHaveLength(2);
      expect(filteredIterationParams[0]).toMatchObject({
        id: '1',
        name: 'Director 1',
        isAuthoritativeSignatory: true,
      });
      expect(filteredIterationParams[1]).toMatchObject({
        id: '3',
        name: 'Director 3',
        isAuthoritativeSignatory: true,
      });

      const result = await iterativePlugin.invoke(mockContext);
      expect(result.callbackAction).toBe('SUCCESS');
    });

    it('should return all items when no filter is provided', async () => {
      const mockContext = {
        entity: {
          data: {
            additionalInfo: {
              directors: [
                { id: '1', name: 'Director 1', isAuthoritativeSignatory: true },
                { id: '2', name: 'Director 2', isAuthoritativeSignatory: false },
              ],
            },
          },
        },
      };

      const jmespathTransformer = new JmespathTransformer('entity.data.additionalInfo.directors');

      const iterativePlugin = new IterativePlugin({
        name: 'test_no_filter_plugin',
        stateNames: ['test_state'],
        iterateOn: [jmespathTransformer],
        action: async context => {
          return { result: 'success' };
        },
        successAction: 'SUCCESS',
        errorAction: 'ERROR',
      });

      const filteredIterationParams = iterativePlugin.filterItems(
        mockContext.entity.data.additionalInfo.directors,
      );

      expect(filteredIterationParams).toHaveLength(2);
      expect(filteredIterationParams).toEqual(mockContext.entity.data.additionalInfo.directors);

      const result = await iterativePlugin.invoke(mockContext);
      expect(result.callbackAction).toBe('SUCCESS');
    });

    it('should apply multiple filters with AND condition', async () => {
      const mockContext = {
        entity: {
          data: {
            additionalInfo: {
              directors: [
                { id: '1', name: 'Director 1', isAuthoritativeSignatory: true, age: 35 },
                { id: '2', name: 'Director 2', isAuthoritativeSignatory: false, age: 40 },
                { id: '3', name: 'Director 3', isAuthoritativeSignatory: true, age: 25 },
                { id: '4', name: 'Director 4', isAuthoritativeSignatory: false, age: 30 },
              ],
            },
          },
        },
      };

      const jmespathTransformer = new JmespathTransformer('entity.data.additionalInfo.directors');

      const iterativePlugin = new IterativePlugin({
        name: 'test_multiple_filters_plugin',
        stateNames: ['test_state'],
        iterateOn: [jmespathTransformer],
        action: async context => {
          return { result: 'success' };
        },
        filter: [
          {
            strategy: 'json-logic',
            value: { '==': [{ var: 'isAuthoritativeSignatory' }, true] },
          },
          {
            strategy: 'json-logic',
            value: { '>': [{ var: 'age' }, 30] },
          },
        ],
        successAction: 'SUCCESS',
        errorAction: 'ERROR',
      });

      const filteredIterationParams = iterativePlugin.filterItems(
        mockContext.entity.data.additionalInfo.directors,
      );

      expect(filteredIterationParams).toHaveLength(1);
      expect(filteredIterationParams[0]).toMatchObject({
        id: '1',
        name: 'Director 1',
        isAuthoritativeSignatory: true,
        age: 35,
      });

      const result = await iterativePlugin.invoke(mockContext);
      expect(result.callbackAction).toBe('SUCCESS');
    });
  });

  describe('invoke functionality', () => {
    it('should return success with warning when iterate param is not an array', async () => {
      const mockContext = {
        entity: {
          data: {
            additionalInfo: {
              // Not an array
              directors: { id: '1', name: 'Director 1' },
            },
          },
        },
      };

      const jmespathTransformer = new JmespathTransformer('entity.data.additionalInfo.directors');

      const iterativePlugin = new IterativePlugin({
        name: 'test_non_array_plugin',
        stateNames: ['test_state'],
        iterateOn: [jmespathTransformer],
        action: async context => {
          return { result: 'success' };
        },
        successAction: 'SUCCESS',
        errorAction: 'ERROR',
      });

      const result = await iterativePlugin.invoke(mockContext);
      expect(result.callbackAction).toBe('SUCCESS');
      expect(result.warnnings).toContain('Iterative plugin could not find iterate on param');
    });

    it('should return empty array when filterItems is called with non-array input', async () => {
      const iterativePlugin = new IterativePlugin({
        name: 'test_filter_non_array_plugin',
        stateNames: ['test_state'],
        iterateOn: [new JmespathTransformer('some.path')],
        action: async context => {
          return { result: 'success' };
        },
        successAction: 'SUCCESS',
        errorAction: 'ERROR',
      });

      // @ts-ignore - Testing with invalid input
      const result = iterativePlugin.filterItems(null);
      expect(result).toEqual([]);
    });

    it('should call action for each filtered item', async () => {
      const mockContext = {
        entity: {
          data: {
            additionalInfo: {
              directors: [
                { id: '1', name: 'Director 1', isAuthoritativeSignatory: true },
                { id: '2', name: 'Director 2', isAuthoritativeSignatory: false },
                { id: '3', name: 'Director 3', isAuthoritativeSignatory: true },
              ],
            },
          },
        },
      };

      const jmespathTransformer = new JmespathTransformer('entity.data.additionalInfo.directors');
      const actionSpy = vi.fn().mockResolvedValue({ result: 'success' });

      const iterativePlugin = new IterativePlugin({
        name: 'test_action_calls_plugin',
        stateNames: ['test_state'],
        iterateOn: [jmespathTransformer],
        action: actionSpy,
        filter: [
          {
            strategy: 'json-logic',
            value: { '==': [{ var: 'isAuthoritativeSignatory' }, true] },
          },
        ],
        successAction: 'SUCCESS',
        errorAction: 'ERROR',
      });

      const result = await iterativePlugin.invoke(mockContext);

      expect(result.callbackAction).toBe('SUCCESS');
      expect(actionSpy).toHaveBeenCalledTimes(2);
      expect(actionSpy).toHaveBeenCalledWith({
        id: '1',
        name: 'Director 1',
        isAuthoritativeSignatory: true,
      });
      expect(actionSpy).toHaveBeenCalledWith({
        id: '3',
        name: 'Director 3',
        isAuthoritativeSignatory: true,
      });
    });
  });

  describe('transform functionality', () => {
    it('should handle complex nested transformations', async () => {
      const mockContext = {
        entity: {
          data: {
            company: {
              shareholders: [
                { id: 's1', name: 'Shareholder 1', ownership: 30 },
                { id: 's2', name: 'Shareholder 2', ownership: 70 },
              ],
            },
            people: {
              employees: [
                { id: 'e1', name: 'Employee 1', role: 'manager' },
                { id: 'e2', name: 'Employee 2', role: 'staff' },
              ],
            },
          },
        },
      };

      // Transform to get a combined array of shareholders and employees with high ownership or manager role
      const shareholdersTransformer = new JmespathTransformer('entity.data.company.shareholders');
      const employeesTransformer = new JmespathTransformer('entity.data.people.employees');

      // Mock action to just return the context for testing
      const actionSpy = vi.fn().mockImplementation(context => Promise.resolve(context));

      const iterativePlugin = new IterativePlugin({
        name: 'test_complex_transform_plugin',
        stateNames: ['test_state'],
        iterateOn: [shareholdersTransformer], // First transformer gets shareholders
        action: actionSpy,
        filter: [
          {
            strategy: 'json-logic',
            value: { '>=': [{ var: 'ownership' }, 50] }, // Only shareholders with >= 50% ownership
          },
        ],
        successAction: 'SUCCESS',
        errorAction: 'ERROR',
      });

      await iterativePlugin.invoke(mockContext);

      // Only Shareholder 2 with 70% ownership should be processed
      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith({
        id: 's2',
        name: 'Shareholder 2',
        ownership: 70,
      });

      // Now test with employees
      actionSpy.mockClear();

      const employeeIterativePlugin = new IterativePlugin({
        name: 'test_employees_transform_plugin',
        stateNames: ['test_state'],
        iterateOn: [employeesTransformer], // Get employees
        action: actionSpy,
        filter: [
          {
            strategy: 'json-logic',
            value: { '==': [{ var: 'role' }, 'manager'] }, // Only managers
          },
        ],
        successAction: 'SUCCESS',
        errorAction: 'ERROR',
      });

      await employeeIterativePlugin.invoke(mockContext);

      // Only Employee 1 who is a manager should be processed
      expect(actionSpy).toHaveBeenCalledTimes(1);
      expect(actionSpy).toHaveBeenCalledWith({
        id: 'e1',
        name: 'Employee 1',
        role: 'manager',
      });
    });

    it('should handle empty array results from transformers', async () => {
      const mockContext = {
        entity: {
          data: {
            additionalInfo: {
              directors: [], // Empty array
            },
          },
        },
      };

      const jmespathTransformer = new JmespathTransformer('entity.data.additionalInfo.directors');
      const actionSpy = vi.fn().mockResolvedValue({ result: 'success' });

      const iterativePlugin = new IterativePlugin({
        name: 'test_empty_array_plugin',
        stateNames: ['test_state'],
        iterateOn: [jmespathTransformer],
        action: actionSpy,
        successAction: 'SUCCESS',
        errorAction: 'ERROR',
      });

      const result = await iterativePlugin.invoke(mockContext);

      expect(result.callbackAction).toBe('SUCCESS');
      expect(actionSpy).not.toHaveBeenCalled(); // Action should not be called for empty array
    });
  });
});
