---
title: How to use webhooks
description: A guide on setting up and handling webhooks to receive real-time notifications from Ballerine's system events.
---

**Ballerine supports two types of webhooks: system webhooks and custom webhooks.
These webhooks allow you to integrate external systems and automate actions based on specific events in your workflows.**

## How to Use Webhooks

Webhooks enable your application to be notified in real-time when specific events occur within the system. For example, when a final decision is made on a case, a webhook can be sent that includes all of the case’s data (data from the collection flow, third-party providers, risk results, and manual reviewer decisions).

### System Webhooks

System webhooks are predefined hooks that trigger on lifecycle events within the system. These events include:

- Workflow completion
- Document state changes

#### Subscription Levels

System webhooks can be subscribed to at three levels:

1. **Customer Level**: Receive all events about all workflows and system events.
2. **Workflow Definition Level**: Receive notifications about all executions of a specific workflow definition.
3. **Workflow Execution/Runtime Level**: Subscribe to events for a specific workflow instance.

#### Example Configuration

A workflow can take a configuration object to set up subscriptions:

```json
{
  "config": {
    "subscriptions": [
      {
        "type": "webhook",
        "url": "https://webhook.site/b58610f1-93fc-4922-96c6-87d259f245b8",
        "events": [
          "workflow.context.document.changed"
        ]
      }
    ]
  }
}
```

A full run request with subscription will look like this:
```bash
curl --location 'http://localhost:3000/api/v1/external/workflows/run' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer secret' \
--data '{
    "context": {
        "documents": [
            {
                "properties": {},
                "pages": [
                    {
                        "metadata": {
                            "pageNumber": 1
                        },
                        "provider": "http",
                        "type": "jpg",
                        "uri": "https://upload.wikimedia.org/wikipedia/commons/s.jpg"
                    }
                ],
                "category": "proof_of_ownership",
                "type": "property_rate",
                "version": 1,
                "issuer": {
                    "country": "US"
                }
            },
        ],
        "entity": {
            "data": {
                "companyName": "YTO CENTRE",
                "additionalInfo": {
            
                },
                "businessType": "SMB"
            },
            "id": "0a5212e0-ba12422222011b7",
            "type": "business"
        }
    },
    "config": {
        "subscriptions": [
            {
                "type": "webhook",
                "url": "https://webhook.site/b58610f1-93fc-4922-96c6-87d259f245b8",
                "events": [
                    "workflow.completed"
                ]
            }
        ]
    },
    "workflowId": "mp0h897g68v"
}'
``` 

System webhooks are useful for monitoring and reacting to important events in real-time.

### Custom Webhooks

Custom webhooks can be added as plugins to your workflows. These webhooks allow for greater flexibility and customization, enabling you to define specific actions that should be taken at various points in the workflow.

#### Example Custom Webhook Configuration

Here is an example of a custom webhook configuration:

```json
{
  "name": "backend_update_webhook",
  "url": "https://webhook.site/5b76ead0-70b8-494b-b639-cfc531517816",
  "method": "POST",
  "stateNames": [
    "calculate_risk",
    "collection_flow"
  ],
  "headers": {
    "authorization": "Bearer {secret.BUSINESS_DATA__VENDOR_API_KEY}"
  },
  "request": {
    "transform": {
      "transformer": "jmespath",
      "mapping": "{success_result: @}"
    }
  }
}
```

#### Explanation

1. **Name (`name`)**:
    - The name of the webhook, in this case, `backend_update_webhook`.
2. **URL (`url`)**:
    - The URL to which the webhook should send the request. This URL is where your external system will receive the webhook payload.
3. **Method (`method`)**:
    - The HTTP method to be used for the webhook request. In this example, it is set to `POST`.
4. **State Names (`stateNames`)**:
    - An array of state names where the webhook should be triggered. In this example, the webhook will be triggered during the `calculate_risk` and `collection_flow` states.
5. **Headers (`headers`)**:
    - Any headers that should be included in the webhook request. In this example, an `authorization` header is included, with a bearer token that references a secret key.
6. **Request (`request`)**:
    - **Transform (`transform`)**: Specifies how the data should be transformed before being sent.
        - **Transformer (`transformer`)**: The transformation tool to use, in this case, `jmespath`.
        - **Mapping (`mapping`)**: The mapping rule for transforming the data. Here, it maps the entire payload to `success_result`.

## Webhook Structure

A webhook will have the following data structure:

```json
{
    "id": "uuid",
    "eventName": "workflow.context.document.completed",
    "apiVersion": 1,
    "timestamp": "ISO_STRING",
    "assignedAt": "ISO_STRING",
    "assignee": {
        "id": "assigneeId",
        "firstName": "firstName",
        "lastName": "lastName",
        "email": "email"
    },
    "workflowCreatedAt": "ISO_STRING",
    "workflowResolvedAt": "ISO_STRING",
    "workflowDefinitionId": "uuid",
    "workflowRuntimeId": "uuid",
    "ballerineEntityId": "uuid",
    "correlationId": "uuid",
    "environment": "sandbox", // or production
    "data": {} // updateContext
}
```

### Properties

- **id**: Unique identifier for the webhook event.
  - Type: string
- **eventName**: The name of the event that triggered the webhook.
  - Type: string
  - Possible Values:
    - 'workflow.context.document.completed' - Triggered when a case is approved or rejected.
    - 'workflow.context.document.updated' - Triggered when there is an action (like a request for revisions, vendor check retrieved, etc.) made on an active case.
- **apiVersion**: The version of the API used for the webhook.
  - Type: number
- **timestamp**: The ISO 8601 date and time when the event occurred.
  - Type: string
- **assignedAt**: The ISO 8601 date and time when the case was assigned.
  - Type: string
- **assignee**: Details of the assignee.
  - Type: object
  - Properties:
    - **id**: Type: string
    - **firstName**: Type: string
    - **lastName**: Type: string
    - **email**: Type: string
- **workflowCreatedAt**: The ISO 8601 date and time when the workflow was created.
  - Type: string
- **workflowResolvedAt**: The ISO 8601 date and time when the workflow was resolved.
  - Type: string
- **workflowDefinitionId**: Unique identifier for the workflow definition.
  - Type: string
- **workflowRuntimeId**: Unique identifier for the workflow runtime instance.
  - Type: string
- **ballerineEntityId**: Unique identifier for the Ballerine entity.
  - Type: string
- **correlationId**: Unique identifier for correlating between entity IDs in your systems and Ballerine’s system.
  - Type: string
- **environment**: The environment where the event occurred.
  - Type: string
  - Possible Values: sandbox, production
- **data**: Additional data relevant to the event.
  - Type: object

## Example Use Cases

### Notification on Case Approval/Rejection

Use the 'workflow.context.document.completed' event to trigger notifications or update your system when a case is approved or rejected.

### Tracking Case Updates

Use the 'workflow.context.document.updated' event to monitor changes to active cases and take appropriate actions based on the updates (for example, when the case changes to “manual review”, “revisions”, “awaiting 3rd party data”, and other active workflow states).

## Handling Webhooks

To handle incoming webhooks, your endpoint should be able to:

- Parse the JSON payload.
- Validate the source of the webhook.
- Process the event data according to your application logic.

### Security Recommendations

- **Verify Webhook Signatures**: Ensure that the webhook requests are coming from Ballerine by verifying the signatures included in the request headers.
- **HTTPS**: Always use HTTPS for your webhook endpoint to ensure data security during transmission.

By configuring system and custom webhooks, you can ensure that your workflows are integrated with external systems and can trigger automated actions based on specific events and conditions.

You can refer to our API docs to see all system events triggered via webhooks: [Ballerine API Documentation](https://api-sb.eu.ballerine.app/api#/webhooks/postworkflows)

