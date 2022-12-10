---
title: Introduction
description: Docs intro
layout: ../../../layouts/MainLayout.astro
---

<div align="center">

<a href="https://ballerine.io" title="Ballerine - Open-source Infrastructure for Identity and Risk management.">
    <img src="/ballerine-logo.png" alt="Ballerine's website">
    <span class="ballerine-span">Ballerine</span>
</a>

# Open-source Infrastructure for User Identity and Risk Management

</br>

  <!-- Bagdes - Start -->

<a href="https://github.com/ballerine-io/ballerine/stargazers"><img src="https://img.shields.io/github/stars/ballerine-io/ballerine?logo=GitHub&style=flat-square"></a>
<a href="https://ycombinator.com"><img src="https://img.shields.io/website?color=%23f26522&down_message=Y%20Combinator&label=Backed&logo=ycombinator&style=flat-square&up_message=Y%20Combinator&url=https%3A%2F%2Fwww.ycombinator.com"></a>
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)
[![GitHub release](https://img.shields.io/github/v/release/ballerine-io/ballerine?label=last-release&style=flat-square)](https://github.com/ballerine-io/ballerine/releases)
[![GitHub release](https://img.shields.io/github/workflow/status/ballerine-io/ballerine/CI/main?label=e2e&style=flat-square)](https://github.com/ballerine-io/ballerine/actions/workflows/ci.yml)

<!-- Bagdes - END -->

</div>

### Description

Ballerine helps any company verify its customers’ identity while providing an amazing user experience by composing verification processes for any vertical and geography using modular building blocks, components, and 3rd party integrations.

### What can you find in this project?

- KYC/KYB flows and UI in Mobile & web SDK - ✓ Open Source!
- Case management dashboard for users approval/rejection - 🎉 Final stages of Open Sourcing!
- Identity & risk vendors orchestration - ⏳ Almost done
- No-code rule engine to control Frontend and backend flows - 🚧 WIP

[See Detailed Roadmap](#roadmap)

Join our mailing list so you know whenever we release something (like liveliness or the case management back office).

<br/>

<a href="https://www.ballerine.io/mailing-list" title="Ballerine - Request Access">
    <img width="160px" src="https://blrn-staging-assets.s3.eu-central-1.amazonaws.com/email-updates.png" alt="Ballerine's Early Access">
</a>

---

## Why Open Source KYC/KYB & Risk stack?

The goal is to allow any company to manage user identity and risk in a way that suits them and their unique changing needs.
Main Open Source benefits:

- **Future proof** - modular and extendable building blocks.
- **Global** - Multiple vendors accessible in one UI and case management dashboard.
- **White label** - Customizable UX and UI.
- **Community** - Use what others have built, contribute yourself, and leverage community maintenance.

<details>

<summary>
See some examples of what you can do with it
</summary>

- Use different vendors for different audiences - all modules are 100% vendor agnostic.
- Create your own low-cost KYC with AWS Rekognition, Google vision, and other ML tools.
- Collect documents in a KYB flow.
- Implement and modify a case management for user approval/rejection.
- And more.

If you currently don't have a commercial agreement with KYC vendors, you can use some of the vendors we already integrated with (Identity verification, AML check, etc.), to quickly start processing user's KYC requests. To do so please contact us at oss@ballerine.io.

</details>

## Roadmap

Click below to tell us what we should work on next by creating feature requests or upvoting existing one.

</br>
<a href="https://ballerine.canny.io/" title="Ballerine - feature requests">
    <img width="180px" src="https://blrn-staging-assets.s3.eu-central-1.amazonaws.com/vote%20features.png" alt="Ballerine - feature requests">
</a>

#### General

- [ ] Documentation Portal
- [ ] Roadmap Community Voting System

#### Onboarding Suite (KYC/KYB/General Document Collection)

_Please use the voting system if you think we should prioritize higher a specific chunk_

- [ ] SDKs _(WIP)_
  - [x] ~~Open sourcing Web SDK~~
    - [x] ~~UI Customization~~
    - [x] ~~Flow Customization~~
    - [x] ~~Document collection~~
    - [x] ~~Selfie~~
    - [x] ~~KYC/B Templates~~
    - [x] ~~Vendor/Backend Agnostic~~
    - [ ] Web liveliness step
  - [x] Open-sourcing Android SDK
    - [x] ~~Webview Integration~~
    - [x] ~~Native Camera Option~~
    - [ ] Native liveliness _(WIP)_
  - [ ] Open sourcing iOS SDK _(WIP)_
    - [x] ~~Webview Integration~~
    - [x] ~~Native Camera Option~~
- [ ] Backoffice
  - [ ] Open Sourcing Case Management
    - [x] User Approval Queues
    - [ ] Operator Collaborations
    - [x] Backend Agnostic
    - [x] Vendor Agnostic
    - [ ] Transaction Approval Queues
- [ ] Dashboard
  - [ ] Data pipelines (Orchestrator) _(WIP)_
    - [ ] Plugin System
    - Integrations
      - [x] Veriff
      - [x] AWS Rekognition
        - [x] Face Match API
        - [x] Document Classification
      - [ ] Google Vision
        - [ ] Document Classification
        - [x] Vision OCR
  - [ ] No-Code Flow Builder

#### Risk Suite

_Please use the voting system if you think we should prioritize higher a specific chunk_

- [ ] SDKs _(WIP)_
  - [x] ~~Open sourcing Web SDK~~
    - [ ] Behavior data for fraud detection _(WIP)_
    - [ ] Risk-Based KYC/Step-up KYC Templates _(WIP)_
  - [x] Open-sourcing Android SDK
    - [ ] Behavior data for fraud detection _(WIP)_
  - [ ] Open sourcing iOS SDK _(WIP)_
    - [x] ~~Webview Integration~~
    - [x] ~~Native Camera Option~~
- [ ] Backoffice
  - [ ] Open Sourcing Case Management
    - [ ] Operator Collaborations
    - [ ] Transaction Approval Queues
- [ ] Dashboard
  - [ ] Data pipelines (Orchestrator) _(WIP)_
    - Integrations
      - [ ] AWS
        - Fraud Detection
          - [ ] Account Take Over
  - [ ] Rule/Risk Engine _(WIP)_

#### Get to know when we release more parts

Leave us your email on our mailing list and we'll let you know whenever we release a feature or improvement (like liveliness on the camera or the case management back office).

<a href="https://www.ballerine.io/mailing-list" title="Ballerine - Request Access">
    <img width="160px" src="https://blrn-staging-assets.s3.eu-central-1.amazonaws.com/email-updates.png" alt="Ballerine's Early Access">
</a>
</br>
</br>
</br>

---

<i>As you can see, most apps and packages are still private git submodules. We are working on migrating them to this monorepo.</i>\
<i>If you already want to start using them or want to get involved - reach out to us at [oss@ballerine.io](mailto:oss@ballerine.io).</i>
