import { expect, test } from 'vitest';
import { createRuleEngine } from 'src';

test('Simple Server Workflow', t => {
  console.log('Running create Server Workflow');

  const engine = createRuleEngine({ Provider: 'json-logic' });
  const someRule = {
    and: [{ '<': [{ var: 'answer1' }, 10000] }, { '==': [{ var: 'answer2' }, true] }],
  };

  const rule1 = engine.logicRule(someRule);
  const rule2 = engine.logicRule({ '<': [{ var: 'answer1' }, 10000] });
  const data = { answer1: 70, answer2: true };

  const isValid = rule1.evaluate(data) && rule2.evaluate(data);

  expect(isValid).toBe(true);
});

test('Simple Jmespath rule', t => {
  const engine = createRuleEngine({ Provider: 'jmespath' });
  const someRule = 'foo.bar == foo.baz';
  const data = { foo: { bar: 1, baz: 1 } };

  const result = engine.logicRule(someRule).evaluate(data);

  expect(result).toBe(true);
});
