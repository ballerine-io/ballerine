import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { jsonLogicEngineRunner } from './engines/json-logic/json-logic';
import { jsonSchemaEngineRunner } from './engines/json-schema/json-schema';
import {
  addRuleEngineRunner,
  getRuleEngineRunner,
  removeRuleEngineRunner,
  ruleEngineRepository,
} from './rule-engine.repository';
import { TRuleEngineRunner } from './types';

describe('rule-engine.repository', () => {
  describe('getRuleEngineRunner', () => {
    it('should return json-logic runner when json-logic engine is requested', () => {
      const runner = getRuleEngineRunner('json-logic');
      expect(runner).toBe(jsonLogicEngineRunner);
    });

    it('should return json-schema runner when json-schema engine is requested', () => {
      const runner = getRuleEngineRunner('json-schema');
      expect(runner).toBe(jsonSchemaEngineRunner);
    });

    it('should throw error when requesting non-existent engine', () => {
      expect(() => getRuleEngineRunner('non-existent-engine' as any)).toThrow(
        'Rule engine non-existent-engine not found',
      );
    });
  });

  describe('addRuleEngineRunner', () => {
    const mockRunner: TRuleEngineRunner = vi.fn();

    afterEach(() => {
      // Clean up added runners
      delete ruleEngineRepository['custom-engine' as keyof typeof ruleEngineRepository];
    });

    it('should add new engine runner to repository', () => {
      addRuleEngineRunner('custom-engine', mockRunner);
      expect(getRuleEngineRunner('custom-engine')).toBe(mockRunner);
    });

    it('should override existing engine runner', () => {
      const originalRunner = getRuleEngineRunner('json-logic');
      const newMockRunner: TRuleEngineRunner = vi.fn();

      addRuleEngineRunner('json-logic', newMockRunner);
      expect(getRuleEngineRunner('json-logic')).toBe(newMockRunner);

      // Restore original runner
      addRuleEngineRunner('json-logic', originalRunner);
    });
  });

  describe('removeRuleEngineRunner', () => {
    const mockRunner: TRuleEngineRunner = vi.fn();

    beforeEach(() => {
      addRuleEngineRunner('custom-engine', mockRunner);
    });

    it('should remove engine runner from repository', () => {
      removeRuleEngineRunner('custom-engine');
      expect(() => getRuleEngineRunner('custom-engine')).toThrow(
        'Rule engine custom-engine not found',
      );
    });

    it('should not throw when removing non-existent engine', () => {
      expect(() => removeRuleEngineRunner('non-existent-engine')).not.toThrow();
    });
  });
});
