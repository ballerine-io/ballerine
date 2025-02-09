import { describe, expect, it } from 'vitest';
import { formatValueDestination } from './format-value-destination';

describe('formatValueDestination', () => {
  it('should be defined', () => {
    expect(formatValueDestination).toBeDefined();
  });

  describe('formatting', () => {
    it('should format simple value destination', () => {
      const valueDestination = 'tasks[$0].name';
      const stack = [1];

      expect(formatValueDestination(valueDestination, stack)).toBe('tasks[1].name');
    });

    it('should format nested value destination', () => {
      const valueDestination = 'tasks[$0].siblings[$1].name';
      const stack = [1, 2];

      expect(formatValueDestination(valueDestination, stack)).toBe('tasks[1].siblings[2].name');
    });

    it('should handle empty stack', () => {
      const valueDestination = 'tasks.name';
      const stack: number[] = [];

      expect(formatValueDestination(valueDestination, stack)).toBe('tasks.name');
    });

    it('should handle value destination without placeholders', () => {
      const valueDestination = 'tasks[0].siblings[1].name';
      const stack = [1, 2];

      expect(formatValueDestination(valueDestination, stack)).toBe('tasks[0].siblings[1].name');
    });

    it('should replace placeholder with index', () => {
      const valueDestination = 'tasks[$0].siblings[$1].name';
      const stack = [1];

      expect(formatValueDestination(valueDestination, stack)).toBe('tasks[1].siblings[$1].name');
    });
  });
});
