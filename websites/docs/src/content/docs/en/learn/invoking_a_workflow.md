---
title: Invoking a Workflow
description: Instructions on how to invoke a workflow using the API or through the Case Management application.
---

# Invoking a Workflow
nvoking a runtime instance of a workflow definition can be done either via the API or from the Case Management application. Once a workflow is invoked, it starts running from its initial state.

### Invoking a Workflow via API

To invoke a workflow using the API, make a POST request to the following endpoint:

```
POST /api/v1/external/workflows/run
```

**Request Body:**

The payload will depend on the specific workflow being invoked. Below is an example payload:

```
{
  "workflowId": "till_basic_kyb_demo",
  "context": {
    "entity": {
      "type": "business",
      "id": "my-enduser-id111",
      "data": {
        "country": "US",
        "registrationNumber": "756OPOPOP08238",
        "companyName": "TILL COMPANY LIMITED",
        "additionalInfo": {
          "mainRepresentative": {
            "email": "email@ballerine.com",
            "lastName": "Last",
            "firstName": "First"
          }
        }
      }
    },
    "documents": []
  }
}
```

**Example:**

Here’s an example of how to invoke a workflow using `curl`:

```
curl -X POST "<//api/v1/external/workflows/run>" \\
     -H "Content-Type: application/json" \\
     -d '{
           "workflowId": "till_basic_kyb_demo",
           "context": {
             "entity": {
               "type": "business",
               "id": "my-enduser-id111",
               "data": {
                 "country": "US",
                 "registrationNumber": "756OPOPOP08238",
                 "companyName": "TILL COMPANY LIMITED",
                 "additionalInfo": {
                   "mainRepresentative": {
                     "email": "email@ballerine.com",
                     "lastName": "Last",
                     "firstName": "First"
                   }
                 }
               }
             },
             "documents": []
           }
         }'

```

This request starts a new instance of the workflow specified by workflowId, with the provided context data.

<img title="invoke workflow api" alt="invoke workflow api" src="https://uploads-ssl.webflow.com/62a3bad46800eb4715b2faf1/669ed9cf9fad66342cf9bad2_Jul-22-2024%2023-40-18.gif">

### Invoking a Workflow via Case Management Application

1. Navigate to the **Case Management** section of the application.
2. Locate the desired queue.
3. Click the **Add Case Manually** button on the bottom of the case list. This button invokes a workflow based on the current filter settings.
4. Provide any required initial data in the form that appears.
5. Submit the form to start the workflow.

<img title="invoke workflow case management" alt="invoke workflow case management" src="https://uploads-ssl.webflow.com/62a3bad46800eb4715b2faf1/669eda3eabc1c4ad746637a8_Jul-22-2024%2023-57-44.gif">

By using these methods, you can efficiently start new instances of workflows, ensuring that your processes begin with the necessary context and data.
