---
title: Using the case management dashboard
description: A guide to navigating and utilizing the case management dashboard, including filters, case lists, case actions, and status indicators.
---

## **Case management sections**

### **Filters**

On the left side of the screen is a sidebar featuring various Views, or as we call them, filters.

A filter is a categorization for cases of a defined workflow. For instance, clicking on a view labeled “Onboarding” will load the cases in your onboarding workflow, to the case list.

Ballerine can create various filters for you, segmenting your case lists based on different workflows you provide to users (e.g., “onboarding”, ”ongoing monitoring”), or even based on specific user properties (e.g., “Hong Kong Companies”, ”China Companies”).

### **Case list**

Adjacent to the **Filters sidebar** is the **Case List**. This list showcases cases associated with the selected view.

Clicking on a case within this list will display the case’s details and available actions in the case preview section to the right.

### Case

A case encapsulates all relevant information required to decide whether to approve or reject a customer’s application. The data it can contain includes:

- `User Provided Data`: Information directly supplied by the user during the collection process.
- `Registry Provided Data`: Enhanced data sourced from third-party providers.
- `Child Workflow Data`: This includes both user-provided and enriched data, typically concerning an entity that is in relation to the main entity (e.g. UBOs data that comes from various individuals)

### Case actions

Located on the top right corner of a case are the case action buttons. These facilitate the agent's ability to make a conclusive decision and settle the case.

- `Approve` - Confirm and accept the case's validity.
- `Reject` - Decline or dismiss the case.
- `Ask for all re-uploads` - Request users to provide documents or data, that was marked throughout the case, by the agent as problematic, again for verification.

The case action buttons can trigger a few types of actions:

- `Webhook` - Sends a webhook to a URL of your choice, with the case's data, decision, and reasoning.
- `Email`
- `SMS` Soon
- `CRM API Call`

### Case status

When viewing a case, right below the case’s title, you'll find the case’s status.

This status informs the agent about the current condition of the case, signifying whether it’s ready for manual review, has been reviewed already, or if certain processes must still occur before the case can be manually reviewed.

Each status also provides clarity on the actions that can be performed related to that specific case.

The case statuses and their available statuses are:

| Case Status           | Description                                                                                                                                                     | Available case actions                          |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------|
| Collection flow       | The case is not ready for manual review as the user hasn’t completed the collection flow.                                                                        | None                                            |
| Pending process       | The collection flow has been completed, but there are processes that are still taking place for the information of the case to be complete. The available information can already be reviewed, but approval can only be done once the processes conclude. | Reject <br> Ask for all re-uploads              |
| Pending ID verification | The collection flow has been completed, but the UBOs haven’t yet gone through their KYC processes. The available information can already be reviewed, but approval can only be done once the KYC processes conclude. | Reject <br> Ask for all re-uploads              |
| Manual review         | All of the information has been collected and the case is ready to be manually reviewed.                                                                          | Approve <br> Reject <br> Ask for all re-uploads |
| Revisions             | An agent has initiated a request from the user or a UBO to re-upload documents or KYC information.                                                               | Reject                                          |
| Approved              | An agent has reviewed and approved the case.                                                                                                                     | None                                            |
| Rejected              | An agent has reviewed and permanently rejected the case.                                                                                                         | None                                            |


### A Case’s Block

A block encapsulates various data properties of a certain step, topic, third-party data, and more.

| Block type | Read/Write (can an agent edit the information) | Actions |
| --- | --- | --- |
| User provided data block | Read/Write | None |
| Registry-provided data block | Read | None |
| Enriched data block (currently not used) | Read | None |
| Document block | Read/Write | approve
Ask to re-upload |
| KYC block (AKA - Child Workflow) | Read/Write | approve
Ask to re-upload |

### Block actions

- `Ask to re-upload` - An agent can click the “ask to re-upload” button to:
    - **mark** that one or more documents cannot be accepted the way it was sent and new documents should be provided. once the problematic documents have been marked, the agent can click the `Ask for all re-uploads` action on the top of the case, and initiate a re-upload flow. This will send an email to the user, with a link that redirects to a flow in which they can re-upload the problematic document.
    - Instantly initiate a re-upload flow to UBOs whose KYC processes have been problematic.
    this will send an email to the UBO, with a link to a new KYC flow.
- `approve` - An agent can click the “ask to re-upload” button to approve a document or a UBO’s KYC result, the decision will be saved on the case, regardless if there is a decision on the entire case. This way, if other agents work on the case, they can see that a certain document has already been reviewed.

### Block status

Block statuses are presented to inform about the current state of the block.

Only **Document blocks** and **KYC blocks** have **block statuses**, as they are actionable.

- `Approved` - Appears when the content of the block has been approved
- `Re-upload needed` - Appears when the agent clicks the **ask to re-upload** button. this will enable the **Ask for all re-uploads** button and will add a value to a counter on the button.
- `Pending ID Verification` - Appears when a KYC flow has been sent to a UBO, but the UBO hasn't yet gone through the flow.
- `Pending re-upload` - Appears when a re-upload flow has been initiated, both for document re-upload and KYC re-upload.
