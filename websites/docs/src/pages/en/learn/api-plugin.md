---
title: Api Plugin
description: Learn how to configure a plugin for your workflow
layout: ../../../layouts/MainLayout.astro
---

## Description

Api Plugin is a Workflow Definition extension that allows you to configure the functionality of making Api Requests. <br>
The Api Plugin is a generic plugin that can be used to make any type of api request. <br>
The Api Plugin contains the functionality of formatting the request, validating the request, send the api request, format the response and validate the response. <br>
The Api Plugin contains the logic of transitioning to a new state in the workflow depending on the api's response . <br>

## Configuration

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

## Code Example

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
