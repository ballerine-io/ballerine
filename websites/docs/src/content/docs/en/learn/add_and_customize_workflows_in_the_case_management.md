---
title: Add and Customize Workflows in the Case Management
description: A guide on adding filters and customizing workflows in the case management system.
---

# Add and Customize Workflows in the Case Management

## Customizing case management workflows

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

### Customizing a case’s initial attributes

You can customize the "Create Case" form in the Case Management application by modifying the workflow definition. Follow these steps to tailor the input fields for your case creation:

1. **Navigate to the Dashboard:**
Go to the **"Workflow Definitions"** tab in the dashboard.
2. **Inspect and Edit a Workflow:**
Select the workflow you want to customize and click on it to inspect its details. Click the "Edit" button next to the "Definition" JSON.
3. **Modify the Initial State:**
Within the workflow definition, the initial state will contain the schema for the workflow invocation form. Edit this schema to specify the fields and data required for the form.

> ### Example Schema:
> Here is an example of a workflow definition's initial state that includes a schema for an email input field:
>     
>     
> The provided JSON configuration for the "Create Case" form is composed of two main parts: `uiSchema` and `dataSchema`. These components define both the user interface layout and the data structure requirements for initiating a workflow. Here's a detailed explanation of the structure:
> 
> **`meta` Object**
> 
> The `meta` object encapsulates the entire configuration, containing both `uiSchema` and `dataSchema`.
> 
> **`inputSchema` Object**
> 
> Within the `meta` object, the `inputSchema` object contains two key sub-objects: `uiSchema` and `dataSchema`.
> 
> **`uiSchema`**
> 
> The `uiSchema` defines how the form fields should be presented to the user. It specifies titles, labels, visibility, and the order of fields.
> 
> - **Field Titles and Labels:** Customize how each field is labeled in the UI.
>     - Example: `"ui:title": "Entity ID (As represented in your system)"` sets the display title for the `id` field.
> - **Field Visibility:** Control whether a field is shown or hidden.
>     - Example: `"hidden": true` hides the `type` field.
> - **Field Order:** Specify the order in which fields should appear.
>     - Example: `"ui:order": ["email", "firstName", "lastName"]` defines the display order of the nested fields within `mainRepresentative`.
> 
> **Structure Example:**
> 
```json
"uiSchema": {
  "id": {
    "ui:title": "Entity ID (As represented in your system)"
  },
  "data": {
    "ui:label": false,
    "companyName": {
      "ui:title": "Company Name"
    },
    "companyType": {
      "ui:title": "Company Type"
    },
    "additionalInfo": {
      "ui:label": false,
      "mainRepresentative": {
        "email": {
          "ui:title": "Email"
        },
        "lastName": {
          "ui:title": "Last Name"
        },
        "ui:label": false,
        "ui:order": [
          "email",
          "firstName",
          "lastName"
        ],
        "firstName": {
          "ui:title": "First Name"
        }
      }
    }
  },
  "type": {
    "hidden": true
  }
}

```
> 
> **`dataSchema`**
> 
> The `dataSchema` defines the structure of the data, including types, required fields, and nested properties.
> 
> - **Data Types:** Specify the type for each field (e.g., `string`, `object`).
>     - Example: `"type": "string"` defines the `id` field as a string.
> - **Required Fields:** Indicate which fields are mandatory.
>     - Example: `"required": ["id", "type", "data"]` makes `id`, `type`, and `data` required fields.
> - **Nested Properties:** Define the structure of nested objects.
>     - Example: `data` is an object containing further nested objects like `additionalInfo` and `mainRepresentative`.
> 
> **Structure Example:**

```
"dataSchema": {
  "type": "object",
  "required": [
    "id",
    "type",
    "data"
  ],
  "properties": {
    "id": {
      "type": "string"
    },
    "data": {
      "type": "object",
      "required": [
        "companyName",
        "additionalInfo"
      ],
      "properties": {
        "companyName": {
          "type": "string"
        },
        "companyType": {
          "type": "string"
        },
        "additionalInfo": {
          "type": "object",
          "required": [
            "mainRepresentative"
          ],
          "properties": {
            "mainRepresentative": {
              "type": "object",
              "required": [
                "firstName",
                "lastName",
                "email"
              ],
              "properties": {
                "email": {
                  "type": "string",
                  "format": "email"
                },
                "lastName": {
                  "type": "string"
                },
                "firstName": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "type": {
      "type": "string",
      "default": "business"
    }
  }
}

```

### Putting It All Together

The complete configuration uses `uiSchema` to define how the form fields should appear and `dataSchema` to define the underlying data structure and validation requirements. This ensures that the "Create Case" form is both user-friendly and captures all necessary information accurately.

By customizing these schemas, you can control both the presentation and the structure of the data for workflow initiation, ensuring that your workflows have the correct context and data right from the start.

5. **Form Rendering:**
When the "Create Case" form is rendered in the Case Management application, it will display the input fields based on this schema. The data entered in these fields will then be used as the context for the workflow.
6. **Example Use Case:**
For a workflow that starts with some form of communication to an end user, such as sending an email, ensure that the initial state schema includes an email field. This allows the workflow to gather the necessary email address at the point of invocation.

By following these steps, you can ensure that the "Create Case" form in the Case Management application is customized to capture all the necessary information for your workflows, ensuring smooth and accurate data flow into the workflow context.

<img title="Case Management" alt="Case Management" src="https://uploads-ssl.webflow.com/62a3bad46800eb4715b2faf1/669edf5ca06dd3edff5a19b7_Jul-23-2024%2000-23-34.gif">
