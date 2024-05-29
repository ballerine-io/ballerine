# Workshop (Fintech Devcon)
Building a basic KYB flow with LLM plugin and automatic decisions.

We are going to:
* Edit the collection flow with server-side configuration and add form inputs
* Use these inputs for OCR and data extraction
* Create rules to automate decisions
* Get webhook notifications about the workflow decisions

## Setup

### Install Docker and Docker Compose
- [Docker Installation Guide](https://docs.docker.com/get-docker/)
- [Docker Compose Installation Guide](https://docs.docker.com/compose/install/)

### Install Postman
(Optional)
- [Postman Installation Guide](https://www.postman.com/downloads/)

### Clone the Repo in This Specific Branch
(Optional - needed when building from source)
- `git clone -b fintech_devcon https://github.com/tillpayments/ballerine.git`


-----
## Running the Project

### Options:
1. **(Recommended) Download Pre-built Images from GitHub Container Registry:**
   - The images are built from the devcon branch and available in the GitHub Container Registry.
   - Use the following command to fetch and run them:
   - With a clone:
     ```bash
     cd deploy
     docker compose -f docker-compose-ex-prebuilt.yml up
     ```
    - Without a clone:
      ```bash
      curl https://raw.githubusercontent.com/ballerine-io/ballerine/fintech_devcon/deploy/docker-compose-ex-prebuilt.yml -O
      docker-compose -f docker-compose-ex-prebuilt.yml up
      ``````


2. **Build Images from Source Code:**
   - You can build the images directly from the source code instead of downloading pre-built images.
   - Use the following command:
     ```bash
     cd deploy
     docker compose -f docker-compose-ex.yml up
     ```

### What's Running?
- [Collection Flow](http://localhost:5201) - (`localhost:5201`)
- [Case Management](http://localhost:5137) - (`localhost:5137`)
- [Monitoring Dashboard](http://localhost:5200) - (`localhost:5200`)
- [Backend](http://localhost:3000/api) - (`localhost:3000/api`)

---

## Verifying everything works:
#### Apps Credentials
**Username**: `admin@admin.com`
**Password**: `admin`

1. **Start with the [Collection Flow App](http://localhost:5201):**
   - Fill in the forms, and submit.

2. **Seeing That the Workflow State Moved to Manual Review:**
   - Go to the [monitoring dashboard](http://localhost:5200).
   - Move to the "Workflows" tab and click "View Workflow".
   - You should see the new flow in the list, and the state should be "Manual Review."

3. **Open the [Case Management](http://localhost:5137) app:**
   - Click on the specific view that corresponds to the open case.

4. **Approving the Case in the Case Management:**
   - In the case management view, you can proceed with the approval actions.

5. **Seeing the Case State as Approved in the Monitoring Dashboard:**
   - Return to the monitoring dashboard.
   - Check the updated state to verify it is marked as approved.

## Workshop Walkthrough

After everything is running, we can start the walk-through. Below are the steps to follow, and each one involves a request to change the configuration to the backend.

#### If you are using postman:
Import `devcon-workshop.postman_collection.json` from the project root folder (or download: https://github.com/ballerine-io/ballerine/blob/fintech_devcon/devcon-workshop.postman_collection.json) as a new collection to postman


### Step 1: Add Fields to the Collection Flow

We will add a website and a file input.
**Postman Collection Request:** `1. Workflow Definition - (Update Collection Form)`

<details>
<summary>cURL request</summary>

```bash
curl --location --request PATCH 'http://localhost:3000/api/v1/external/workflows/workflow-definition/devcon_example_workflow' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer secret' \
--data '{
    "states": {
        "data_collection": {
            "metadata": {
                "uiSettings": {
                    "multiForm": {
                        "documents": [
                            {
                                "id": "url-document",
                                "type": "url",
                                "name": "customDocument",
                                "provider": "http",
                                "properties": {
                                    "type": "Custom",
                                    "category": "Document"
                                }
                            }
                        ],
                        "steps": [
                            {
                                "id": "companyInformation",
                                "formSchema": {
                                    "properties": {
                                        "website": {
                                            "type": "string",
                                            "title": "Company Website"
                                        }
                                    }
                                },
                                "uiSchema": {
                                    "website": {
                                        "ui:placeholder": "https://google.com"
                                    }
                                }
                            },
                            {
                                "id": "businessDocuments",
                                "formSchema": {
                                    "properties": {
                                        "customDocument": {
                                            "type": "string",
                                            "title": "Document Url"
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }
    }
}'
```
</details>

### Step 2: Edit the workflow (add additional step)
We will add "process_document" step that will be used to call an API for document data extraction.

**Postman Collection Request:** `2. Workflow Definition - (Add Steps)`

<details>
<summary>cURL request</summary>

```bash
curl --location --request PATCH 'http://localhost:3000/api/v1/external/workflows/workflow-definition/devcon_example_workflow?arrayMergeStrategy=by_index' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer secret' \
--data '{
    "states": {
        "data_collection": {
            "on": {
                "start": "process_documents"
            }
        },
        "process_documents": {
            "on": {
                "API_CALL_SUCCESS": [
                    {
                        "target": "manual_review"
                    }
                ],
                "API_CALL_ERROR": [
                    {
                        "target": "manual_review"
                    }
                ]
            }
        }
    }
}'
```
</details>

### Step 3: Add the First Plugin
The LLM plugin will take the custom file uploaded and will use our API to retrieve JSON by the provided JSON schema.

**Postman Collection Request:** `3. Workflow Definition - (Add Plugin)`

<details>
<summary>cURL request</summary>

```bash
curl --location --request PATCH 'http://localhost:3000/api/v1/external/workflows/workflow-definition/devcon_example_workflow' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer secret' \
--data-raw '{
    "extensions": {
        "apiPlugins": [
            {
                "name": "llm_ocr_extraction",
                "pluginKind": "api",
                "url": "https://unified-api-test.eu.ballerine.app/ocr/extract",
                "method": "POST",
                "headers": {
                    "authorization": "Bearer {secret.UNIFIED_API_TOKEN}"
                },
                "stateNames": [
                    "process_documents"
                ],
                "successAction": "API_CALL_SUCCESS",
                "errorAction": "API_CALL_ERROR",
                "request": {
                    "transform": [
                        {
                            "transformer": "jmespath",
                            "mapping": "{images: [{remote: {imageUri: entity.data.dynamicInfo.companyDocuments.customDocument}}]}"
                        }
                    ],
                    "schema": {
                        "type": "object",
                        "properties": {
                            "unifiedSocialCreditCode": {
                                "type": "string"
                            },
                            "companyName": {
                                "type": "string"
                            },
                            "address": {
                                "type": "object",
                                "properties": {
                                    "country": {
                                        "type":"string"
                                    },
                                    "city": {
                                        "type":"string"
                                    },
                                    "street": {
                                        "type":"string"
                                    }
                                }
                            },
                            "expiryDate": {
                                "type":"string"
                            }
                        }
                    }
                },
                "response": {
                    "transform": [
                        {
                            "transformer": "jmespath",
                            "mapping": "@"
                        }
                    ]
                }
            }
        ]
    }
}'
```
</details>

### Step 4: Create a Rule Based on Data
We will create a rule to move either to manual review or automatic flow approval.

**Postman Collection Request:** `4. Workflow Definition - (Add A Rule For Auto Approve)`

<details>
<summary>cURL request</summary>

```bash
curl --location --request PATCH 'http://localhost:3000/api/v1/external/workflows/workflow-definition/devcon_example_workflow?arrayMergeStrategy=by_index' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer secret' \
--data '{
    "states": {
        "data_collection": {
            "on": {
                "start": "process_documents"
            }
        },
        "process_documents": {
            "on": {
                "API_CALL_SUCCESS": [
                    {
                        "target": "approved",
                        "cond": {
                            "type": "json-logic",
                            "options": {
                                "rule": {
                                    "==": [
                                        {
                                            "var": "pluginsOutput.llm_ocr_extraction.parsedData.unifiedSocialCreditCode"
                                        },
                                          {
                                            "var": "entity.data.registrationNumber"
                                        }
                                    ]
                                }
                            }
                        }
                    },
                    {
                        "target": "manual_review"
                    }
                ],
                "API_CALL_ERROR": [
                    {
                        "target": "manual_review"
                    }
                ]
            }
        }
    }
}'
```
</details>


### Step 5: Add the Second Plugin - Webhook Plugin
We'll add a webhook plugin and and setup up an online service to retrieve the webhooks.

**Postman Collection Request:** `5. Workflow Definition - (Add Webhook)`

<details>
<summary>cURL request</summary>

```shell
curl --location --request PATCH 'http://localhost:3000/api/v1/external/workflows/workflow-definition/devcon_example_workflow?arrayMergeStrategy=concat' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer secret' \
--data-raw '{
    "extensions": {
        "apiPlugins": [
            {
                "name": "webhook_final_results",
                "url": "https://webhook.site/91f5bfc1-79d2-4fea-b9d6-a0fe7ce905d5",
                "method": "POST",
                "stateNames": [
                    "approved",
                    "rejected"
                ],
                "request": {
                    "transform": [
                        {
                            "transformer": "jmespath",
                            "mapping": "{workflow_decision: state, data: @}"
                        }
                    ]
                }
            }
        ]

    }
}'
```
</details>
