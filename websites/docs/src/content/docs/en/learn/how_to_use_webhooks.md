# How to use webhooks

## Webhook Events

Ballerine can send chosen system events through webhooks, enabling your application to be notified in real-time when specific events occur within the system. For example, when a final decision is made on a case, a webhook can be sent that includes all of the case's data (data from the collection flow, third-party providers, risk results, and manual reviewer decisions).

### Webhook Structure

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

-   `id`
    
    -   **Description:** Unique identifier for the webhook event.
    -   **Type:** `string`
-   `eventName`
    
    -   **Description:** The name of the event that triggered the webhook.
    -   **Type:** `string`
    -   **Possible Values:**
        -   `'workflow.context.document.completed'` - Triggered when a case is approved or rejected.
        -   `'workflow.context.document.updated'` - Triggered when there is an action (like a request for revisions, vendor check retrieved, etc.) made on an active case.
-   `apiVersion`
    
    -   **Description:** The version of the API used for the webhook.
    -   **Type:** `number`
-   `timestamp`
    
    -   **Description:** The ISO 8601 date and time when the event occurred.
    -   **Type:** `string`
-   `assignedAt`
    
    -   **Description:** The ISO 8601 date and time when the case was assigned.
    -   **Type:** `string`
-   `assignee`
    
    -   **Description:** Details of the assignee.
    -   **Type:** `object`
    -   **Properties:**
        -   `id` - **Type:** `string`
        -   `firstName` - **Type:** `string`
        -   `lastName` - **Type:** `string`
        -   `email` - **Type:** `string`
-   `workflowCreatedAt`
    
    -   **Description:** The ISO 8601 date and time when the workflow was created.
    -   **Type:** `string`
-   `workflowResolvedAt`
    
    -   **Description:** The ISO 8601 date and time when the workflow was resolved.
    -   **Type:** `string`
-   `workflowDefinitionId`
    
    -   **Description:** Unique identifier for the workflow definition.
    -   **Type:** `string`
-   `workflowRuntimeId`
    
    -   **Description:** Unique identifier for the workflow runtime instance.
    -   **Type:** `string`
-   `ballerineEntityId`
    
    -   **Description:** Unique identifier for the Ballerine entity.
    -   **Type:** `string`
-   `correlationId`
    
    -   **Description:** Unique identifier for correlating between entity IDs in your systems and Ballerine's system.
    -   **Type:** `string`
-   `environment`
    
    -   **Description:** The environment where the event occurred.
    -   **Type:** `string`
    -   **Possible Values:** `sandbox`, `production`
-   `data`
    
    -   **Description:** Additional data relevant to the event.
    -   **Type:** `object`
    

### Example Use Cases

-   **Notification on Case Approval/Rejection:**
    
    -   Use the `'workflow.context.document.completed'` event to trigger notifications or update your system when a case is approved or rejected.
-   **Tracking Case Updates:**
    
    -   Use the `'workflow.context.document.updated'` event to monitor changes to active cases and take appropriate actions based on the updates (for example, when the case changes to "manual review", "revisions", "awaiting 3rd party data", and other active workflow states.

### Handling Webhooks

To handle incoming webhooks, your endpoint should be able to:

-   Parse the JSON payload.
-   Verify the webhook source (optional but recommended for security).
-   Process the event data according to your application logic.

### Security Recommendations

-   **Verify Webhook Signatures:** Ensure that the webhook requests are coming from Ballerine by verifying the signatures included in the request headers.
    
-   **HTTPS:** Always use HTTPS for your webhook endpoint to ensure data security during transmission.
