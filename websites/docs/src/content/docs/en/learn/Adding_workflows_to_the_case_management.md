# Customizing case management workflows

To customize your case management to show your various workflows, add filters.
Filters render your different workflows as case queues you can access via the case management

### Adding Filters

To create a new filter (essentially a queue in the case management system), you can use the API endpoint.

```POST /api/v1/workflow-definition/{id}/copy```

This will return a list of existing filters, which you can use as a reference for creating new ones.

### Create a New Filter

To create a new filter, make a POST request to the following endpoint:

```POST /api/v1/external/filters```

**Request Body:**

You will typically need to adjust fields such as workflowDefinitionId, entity, and other relevant parameters. Below is an example request body for creating a new filter:

```
{
  "name": "Till Businesses Onboarding Basic Demo (US)",
  "entity": "businesses",
  "query": {
    "where": {
      "businessId": {
        "not": null
      },
      "workflowDefinitionId": {
        "in": [
          "clyxemn21000bru85vr9f0b5f"
        ]
      }
    },
    "select": {
      "id": true,
      "tags": true,
      "state": true,
      "status": true,
      "context": true,
      "assignee": {
        "select": {
          "id": true,
          "lastName": true,
          "avatarUrl": true,
          "firstName": true
        }
      },
      "business": {
        "select": {
          "id": true,
          "email": true,
          "address": true,
          "website": true,
          "industry": true,
          "createdAt": true,
          "documents": true,
          "legalForm": true,
          "updatedAt": true,
          "vatNumber": true,
          "companyName": true,
          "phoneNumber": true,
          "approvalState": true,
          "businessPurpose": true,
          "numberOfEmployees": true,
          "registrationNumber": true,
          "dateOfIncorporation": true,
          "shareholderStructure": true,
          "countryOfIncorporation": true,
          "taxIdentificationNumber": true
        }
      },
      "createdAt": true,
      "assigneeId": true,
      "workflowDefinition": {
        "select": {
          "id": true,
          "name": true,
          "config": true,
          "version": true,
          "definition": true,
          "contextSchema": true,
          "documentsSchema": true
        }
      },
      "childWorkflowsRuntimeData": true
    }
  },
  "projectId": "till_default"
}

```



<img title="Case Management" alt="Case Management" src="https://uploads-ssl.webflow.com/62a3bad46800eb4715b2faf1/669ed579568cee8d639bcaf1_filters_api.gif">
