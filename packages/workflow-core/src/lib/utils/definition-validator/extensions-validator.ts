import { StateMachine } from 'xstate';
import {
  ISerializableChildPluginParams,
  ISerializableHttpPluginParams,
  SerializableIterativePluginParams,
  SerializableValidatableTransformer,
  SerializableWebhookPluginParams,
} from '../../plugins/external-plugin/types';
import { WorkflowExtensions } from '../../types';
import { ruleValidator } from './rule-validator';
import { isErrorWithMessage } from '@ballerine/common';

export const extensionsValidator = (
  extensions: WorkflowExtensions,
  states: StateMachine<any, any, any>['states'],
) => {
  extensions.apiPlugins?.forEach(plugin => {
    const pluginKind = (plugin as ISerializableHttpPluginParams).pluginKind;
    if (
      pluginKind === 'api' ||
      pluginKind === 'kyb' ||
      pluginKind === 'kyc-session' ||
      pluginKind === 'email' ||
      pluginKind === 'kyc'
    ) {
      validateApiPlugin(plugin as unknown as ISerializableHttpPluginParams, states);
    }

    if (pluginKind === 'webhook') {
      validateWebhookPlugin(plugin as unknown as SerializableWebhookPluginParams);
    }
  });

  extensions.commonPlugins?.forEach(plugin => {
    const pluginKind = (plugin as unknown as ISerializableChildPluginParams).pluginKind;
    if (pluginKind === 'iterative') {
      validateIterativePlugin(plugin as unknown as SerializableIterativePluginParams, states);
    }
  });

  extensions.childWorkflowPlugins?.forEach(plugin => {
    const pluginKind = (plugin as unknown as ISerializableChildPluginParams).pluginKind;
    if (pluginKind === 'child') {
      validateChildPlugin(plugin as unknown as ISerializableChildPluginParams);
    }
  });
};
const validateApiPlugin = (
  plugin: ISerializableHttpPluginParams,
  states: StateMachine<any, any, any>['states'],
): void => {
  validateTransformers(plugin.name, plugin.request.transform);
  plugin.response.transform && validateTransformers(plugin.name, plugin.response.transform);

  validatePluginStateAction(plugin.stateNames, states, plugin.successAction, plugin.errorAction);
};
const validateWebhookPlugin = (plugin: SerializableWebhookPluginParams): void => {
  validateTransformers(plugin.name, plugin.request.transform);
};
const validateIterativePlugin = (
  plugin: SerializableIterativePluginParams,
  states: StateMachine<any, any, any>['states'],
): void => {
  validateMapping('jmespath', plugin.iterateOn);
  validatePluginStateAction(plugin.stateNames, states, plugin.successAction, plugin.errorAction);
};
const validateChildPlugin = (plugin: ISerializableChildPluginParams): void => {
  plugin.transformers?.forEach(transform => {
    validateMapping(
      transform.transformer as Parameters<typeof validateMapping>[0],
      transform.mapping as Parameters<typeof validateMapping>[1],
    );
  });
};

const validateTransformers = (
  pluginName: string,
  transformers: SerializableValidatableTransformer['transform'],
) => {
  transformers.forEach(transform => {
    try {
      if (transform.transformer === 'jmespath')
        validateMapping('jmespath', transform.mapping as string);
      if (transform.transformer === 'json-logic')
        validateMapping('json-logic', transform.mapping as unknown as Record<string, unknown>);
    } catch (ex) {
      throw new Error(
        `Invalid transform for ${pluginName} - type: ${transform.transformer} transformer: ${
          isErrorWithMessage(ex) ? ex.message : ''
        }`,
      );
    }
  });
};

const validatePluginStateAction = (
  pluginStateNames: Array<string>,
  states: Parameters<typeof extensionsValidator>[1],
  successAction?: string,
  errorAction?: string,
) => {
  if (pluginStateNames && successAction) {
    pluginStateNames.forEach(stateName => {
      validateCallbackTransition(states, stateName, successAction, 'successAction');
    });
  }

  if (pluginStateNames && errorAction) {
    pluginStateNames.forEach(stateName => {
      validateCallbackTransition(states, stateName, errorAction, 'errorAction');
    });
  }
};

const validateCallbackTransition = (
  states: Parameters<typeof extensionsValidator>[1],
  currentState: string,
  callbackEvent: string,
  actionName: 'successAction' | 'errorAction',
) => {
  const transitions = states[currentState]!.on;
  if (!Object.keys(transitions).includes(callbackEvent)) {
    throw new Error(`Invalid ${actionName} ${callbackEvent} for state ${currentState}`);
  }
};

const validateMapping = (
  type: 'jmespath' | 'json-logic',
  mapping: string | Record<string, unknown>,
) => {
  return ruleValidator({
    type: type,
    options: { rule: mapping },
  } as unknown as Parameters<typeof ruleValidator>[0]);
};
