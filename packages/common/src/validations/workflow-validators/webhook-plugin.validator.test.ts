import { describe, expect, it } from 'vitest';
import { validate } from "./webhook-plugin.validator";
import {  ZodError } from 'zod';
describe('Webhook Validator', () => {
  describe('validate Webhook Plugin', () => {

    const webhookPlugin = {
      name: 'ballerineEnrichmentHook',
      url: 'https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/business_test_us.json',
      method: 'GET',
      headers: {'some_header': 'some_value'},
      stateNames: ['checkBusinessScore'],
      request: {
        transform: {
          transformer: 'jq',
          mapping: '{data: .entity.id}',
        },
      },
    };

    describe('when webhook plugin is valid', () => {
      it('does not throw validation exception', async () => {
        expect(() => validate(webhookPlugin)).not.toThrow()
      });
    });

    describe('when webhook has response - throws invalid', () => {
      let failingWebhookPlugin = structuredClone(webhookPlugin)
      failingWebhookPlugin.response = {transform: {transformer: 'jq', mapping: '{result: .}'}}

      it('does not throw validation exception', async () => {
        expect(() => validate(failingWebhookPlugin)).toThrowError(ZodError)
      });
    });

    describe('when webhook no request - throws invalid', () => {
      let failingWebhookPlugin = structuredClone(webhookPlugin)
      failingWebhookPlugin.request = undefined

      it('does not throw validation exception', async () => {
        expect(() => validate(failingWebhookPlugin)).toThrowError(ZodError)
      });
    });
  });
});
