import { NodePlugin } from '../node-plugin';
import { PluginAction } from '@ballerine/workflow-core';
import { GPTParams, ModelConfig, PromptConfig } from '../types';

import fetch from 'node-fetch';

const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

const jobs = {
  match_names: (contextSubset: Object) => {
    [
      {
        role: 'system',
        content:
          'Assistant is an intelligent chatbot designed to help buisnesses evaulating thier customers, system will provide 2 names in a json object, probably in different lanauages and the assitant will try to match them and send back an response in valid json value',
      },
      {
        role: 'system',
        content: `Here is a json object with the relevant data: ${JSON.stringify(contextSubset)}`,
      },
      { role: 'user', content: 'Does my customer name in the json object match?' },
    ];
  },
};

export class GPTPlugin extends NodePlugin {
  private modelConfig: ModelConfig;
  private promptConfig: PromptConfig;

  constructor({ name, stateNames, when, modelConfig, promptConfig }: GPTParams) {
    super(name, when, stateNames);
    this.isBlocking = true;
    this.modelConfig = modelConfig;
    this.promptConfig = promptConfig;
  }

  async action({ workflowId, context, event, state }: PluginAction): Promise<void> {
    // Should be request to open api gpt api, which the model config + prompt config
    // Prompt config should be tranformed to something like:
    //
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify({
        // prompt or messages
        messages: this.promptConfig.jobName
          ? // @ts-ignore
            jobs[this.promptConfig.jobName]
          : [{ role: 'user', content: this.promptConfig.prompt }],
        ...this.modelConfig,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });
    const data = await response.json();

    // @ts-ignore
    return data.choices[0].text;
  }
}
