import {StateMachine} from "xstate";
import {
  ISerializableChildPluginParams,
  ISerializableHttpPluginParams, SerializableIterativePluginParams, SerializableWebhookPluginParams,
} from "../../plugins/external-plugin/types";

const validateApiExtentions = (
  extentions: Array<ISerializableHttpPluginParams>,
  states: StateMachine<any, any, any>['states']
): void => {

};
const validateWebhookExtentions = (
  extentions: Array<SerializableWebhookPluginParams>,
  states: StateMachine<any, any, any>['states']
): void => {

};
const validateIterativeExtentions = (
  extentions: Array<SerializableIterativePluginParams>,
  states: StateMachine<any, any, any>['states']
): void => {

};
const validateChildExtentions = (
  extentions: Array<ISerializableChildPluginParams>,
  states: StateMachine<any, any, any>['states']
): void => {

};
