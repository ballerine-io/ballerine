---
title: Plugins
description: Learn how to configure a plugin for your workflow
layout: ../../../layouts/MainLayout.astro
---

____
## API Plugin
### Description

The API Plugin is a flexible extension that can be added to your workflow definition. It allows you to configure and make API requests directly from your workflows.<br>This guide will help you understand how to set up and use the API Plugin in your workflows.

### Overview
The API Plugin serves several functions in your workflow:

- Request Formatting: It allows you to shape the API request in the format your endpoint requires.
- Request Validation: You can validate the formatted request before sending it.
- API Call: It performs the actual API call.
- Response Formatting: It formats the received response in a way that suits your workflow.
- Response Validation: The formatted response is validated before further use.
- State Transitioning: Depending on the API response, it can move the workflow to different states.

### Configuration

- `name` (Required) - The name of the plugin. the name will also be used as the Api Plugin's response key in the workflow's context.
- `url` (Required) -  The URL destination which the Api Plugin will generate the call to.<br>p.s you can transform the the url by wrapping the require variable path with Braces e.g.`https://example.com/identity/{entity.id}/location`
- `method` (Required) - The method of the Api Request ('POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET')
- `headers` (Optional) - The headers which the Api Plugin uses in order generate the call with (default: `{"Content-Type": "application/json"}`). you can also use the header's values as a secret when it is set. e.g. `{"Authorization": "secret.API_AUTHORIZATION_KEY"}`
- `stateNames` (Required) - The state names from Which the api request will be made from.
- `request` (Required) - The request Transformation and Validation configuration.
  - `transform` (Required) - The request wrapper of the Transformer and Mapping configuration.
    - `transformer` (Required) - The transformer function which will be used to transform the request before it is sent. (default [jmespath](https://jmespath.org/))
    - `mapping` (Required) - The transformation logic which will be used in order to transform the request before it is sent.
  - `schema` (Optional) - The wrapper of the Validator configuration and Validation schema.
    - `validator` - The validator function which will be used to validate the request after it is transformed and before it is sent. (default [json-schema](https://json-schema.org/))
    - `schema` - The Validation schema that the validator uses.
- `response` (Required) - The response wrapper of the Transformer and Mapping configuration.
  - `transform` (Required) - The response wrapper of the Transformer and Mapping configuration.
    - `transformer` (Required) - The transformer function which will be used to transform the response's body after it is received. (default [jmespath](https://jmespath.org/))
    - `mapping` (Required) - The transformation logic which will be used in order to transform the response after it is received.
  - `schema` (Optional) - The wrapper of the Validator configuration and Validation schema.
    - `validator` - The validator function which will be used to validate the response after it is transformed it is persisted to the context. (default [json-schema](https://json-schema.org/))
    - `schema` - The Validation schema that the validator uses.
- `successAction` (Required) - The State to which will the action will be transition if the api request was successful and it passed all the validations.
- `errorAction` (Required) - The State which the workflow will transition to if the api request failed or did not passed all the validations.

### Code Example

The following Plugin can be used to configure an extension in the workflow [configuration](#configuration) - [API reference](/en/learn/workflow_definitions)

```json
{
  "name": "business_data_vendor",
    "url": "https://simple-kyb-demo.s3.eu-central-1.amazonaws.com/mock-data/business_test_eu.json",
    "method": "GET",
    "stateNames": ["check_business_details"],
    "successAction": "API_CALL_SUCCESS",
    "errorAction": "API_CALL_ERROR",
    "request": {
    "transform": {
      "transformer": "jmespath",
        "mapping": "{ business_name: entity.data.companyName, registration_number: entity.data.registrationNumber}"
    },
    "schema": {
      "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
        "business_name": { "type": "string" },
        "registration_number": { "type": "string" }
      },
      "required": ["business_name", "registration_number"]
    }
  },
  "response": {
    "transform": {
      "transformer": "jmespath",
        "mapping": "@"
    },
    "schema": {
      "$schema": "http://json-schema.org/draft-07/schema#",
        "type": "object",
        "properties": {
        "business_details": {
          "type": "object",
            "properties": {
            "registered_name": { "type": "string" },
            "registration_number": { "type": "string" },
            "address": { "type": "object" },
            "contact_number": { "type": "string" }
          }
        },
        "name_fuzziness_score": { "type": "number", "minimum": 0, "maximum": 1 }
      }
    }
  }
}
```

This configuration makes a GET request to an external API, transforms and validates the request and response data, and transitions to appropriate states based on the API call's success or failure.

Understanding and leveraging the flexibility of the API Plugin can significantly expand the capabilities of your workflows. It allows you to connect your workflows with external APIs, retrieve and manipulate data, and make dynamic decisions based on the results.

____
# Webhook Plugin
### Description

The Webhook Plugin is a handy extension that can be added to your workflow definition. It allows you to configure outgoing webhooks directly from your workflows to your required destination.
This guide will help you understand how to set up and use the Webhook Plugin in your workflows.

Overview
The Webhook Plugin serves several functions in your workflow:

Request Formatting: It enables you to shape the webhook request to match your endpoint's needs.
Request Validation: It lets you verify the formatted request before sending it out.
Webhook Call: It makes the actual webhook call.
Webhook Monitoring: It listens for a specific state in the workflow to initiate the webhook.

The primary difference between the [API Plugin](/en/learn/api-plugin) and the Webhook Plugin is that the Webhook Plugin does not directly handle responses or transition states. Instead, it listens to specific states in the workflow to trigger webhook calls.

### Configuration

- `name` (Required) - The name of the plugin. the name will also be used as the Api Plugin's response key in the workflow's context.
- `url` (Required) -  The URL destination which the Api Plugin will generate the call to.<br>p.s you can transform the the url by wrapping the require variable path with Braces e.g.`https://example.com/identity/{entity.id}/location`
- `method` (Required) - The method of the Api Request ('POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET')
- `headers` (Optional) - The headers which the Api Plugin uses in order generate the call with (default: `{"Content-Type": "application/json"}`). you can also use the header's values as a secret when it is set. e.g. `{"Authorization": "secret.API_AUTHORIZATION_KEY"}`
- `stateNames` (Required) - The state names from Which the api request will be made from.
- `request` (Required) - The request Transformation and Validation configuration.
  - `transform` (Required) - The request wrapper of the Transformer and Mapping configuration.
    - `transformer` (Required) - The transformer function which will be used to transform the request before it is sent. (default [jmespath](https://jmespath.org/))
    - `mapping` (Required) - The transformation logic which will be used in order to transform the request before it is sent.
  - `schema` (Optional) - The wrapper of the Validator configuration and Validation schema.
    - `validator` - The validator function which will be used to validate the request after it is transformed and before it is sent. (default [json-schema](https://json-schema.org/))
    - `schema` - The Validation schema that the validator uses.

### Code Example

The following Plugin can be used to configure an extension in the workflow [configuration](#configuration) - [API reference](/en/learn/workflow_definitions)

```json
  {
    "name": "finish_webhook",
    "url": "https://webhook.site/3c48b14f-1a70-4f73-9385-fab2d0db0db8",
    "method": "POST",
    "stateNames": [
      "auto_approve",
      "approve",
      "reject"
    ],
    "headers": {
      "authorization": "Bearer {secret.BUSINESS_DATA__VENDOR_API_KEY}"
    },
    "request": {
      "transform": {
        "transformer": "jmespath",
        "mapping": "{success_result: pluginsOutput.business_data_vendor}"
      }
    }
  },
  {
    "name": "fail_webhook",
    "url": "https://webhook.site/3c48b14f-1a70-4f73-9385-fab2d0db0db8",
    "method": "POST",
    "stateNames": [
      "auto_reject"
    ],
    "request": {
      "transform": {
        "transformer": "jmespath",
        "mapping": "{failing_result: @}"
      }
    }
  }

```

By integrating the Webhook Plugin into your workflows, you can easily set up outgoing webhooks to interact with external systems based on the workflow's state, thereby extending the power and flexibility of your workflows.
