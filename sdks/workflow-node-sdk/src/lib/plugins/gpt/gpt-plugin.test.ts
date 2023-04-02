import { expect, test } from 'vitest';
import { GPTPlugin } from './gpt-plugin';

test('TBD', t => {
  console.log('start');
  const gptPlugin = new GPTPlugin({ name: 'gpt', stateNames: [], when: 'post', modelConfig: {} });
  const res = gptPlugin.action({ workflowId: '123', context: {}, event: {}, state: {} });
  console.log('🚀 ~ file: gpt-plugin.test.ts:7 ~ res:', res);

  expect(true).toBeTruthy();
});
