---
title: KYC Manual Review Workflow Guide
description: KYC Manual Review Workflow Guide
layout: ../../../layouts/MainLayout.astro
---

In this guide, we will go through the KYC Manual Review workflow step-by-step. This workflow involves collecting KYC data through a user interface, reviewing the collected data in the backoffice application, and then reflecting the decision made in the backoffice in the user interface.

## Prerequisites

Before we start, please make sure you have all the necessary dependencies installed. If you haven't done so already, you can find the installation instructions on our installation page.

## Running the KYC Manual Review Workflow

First, we need to start the backend services and the user interface for the KYC Manual Review workflow. You can do this by running the following command:

```sh
pnpm kyc-manual-review-example
```

After running this command, your default browser should automatically open two tabs. One for the KYC UI, and another for the backoffice application.

If the tabs didn't open automatically, please manually navigate to the links provided in the terminal output.

## The KYC Data Collection Flow

In the KYC UI tab, click on the "Start KYC" button to start the data collection process. This process involves filling in personal details, uploading required documents, and finally submitting the data for review.

As you navigate through the data collection process, your progress will be automatically saved in the backend. This feature allows users to pick up where they left off, even if they continue the process on a different device.

Here is a brief overview of the states involved in this process:

- `welcome`: The initial state where the user starts the KYC process.
- `document_selection`: The user selects the documents to upload.
- `document_photo`: The user uploads photos of the selected documents.
- `document_review`: The user reviews the uploaded documents.
- `selfie`: The user takes and uploads a selfie.
- `selfie_review`: The user reviews the uploaded selfie.
- `final`: The final state indicating the completion of the data collection process.

All these states are part of a [statechart](https://xstate.js.org/docs/guides/statecharts.html#statechart-example) defined in the client application, orchestrated by the headless SDK.

The states `document_review`, `document_selection`, and `final` are persisted in the backend, allowing the user's progress to be saved and resumed later. The state `document_photo` is a submit state, meaning that when the user moves from this state to the next, the workflow backend is informed of the transition.

## Reviewing KYC Data in the Backoffice

After the user submits the KYC data, a new case will appear in the backoffice application. In the backoffice, you can review the submitted data, and decide whether to approve, reject, or ask the user to resubmit some documents. For example, you might ask the user to resubmit a document if the uploaded photo is blurry.

To review a case:

1. Go to the backoffice tab in your browser.
2. Click on the new case that appeared after the user submitted the KYC data.
3. Review the data and decide whether to approve, reject, or ask for resubmission.

## Reflecting the Decision in the KYC UI

After you make a decision in the backoffice, the workflow context will be updated accordingly. The updated context will then be reflected in the KYC UI.

To see the result of the review:

1. Go back to the KYC UI tab in your browser.
2. You will see the result of the review, whether the KYC data was approved, rejected, or needs to be resubmitted.

Remember: this is an example workflow showcasing our system's capabilities. In real-world applications, the workflow can be

 much more complex, involving multiple review stages, automatic data checks, integration with external services, and much more.

Enjoy exploring our system, and please feel free to reach out if you have any questions or run into any issues!

---
