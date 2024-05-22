<div align="right">
<img  src="https://uploads-ssl.webflow.com/62a3bad46800eb4715b2faf1/6463b137c0fec38f87389eb6_star_AdobeExpress%20(2).gif"  alt="Alt Text"  style="width: 100%; height: auto;">
</div>

<div align="center">

<a href="https://ballerine.com" title="Ballerine - Open-source Infrastructure for Identity and Risk management.">
    <img src="https://uploads-ssl.webflow.com/62a3bad46800eb4715b2faf1/646372b198f456345c69339c_logo%20github.png" alt="Ballerine's website">
</a>

## Open-Source Risk Management Infrastructure

<br/>

  <!-- Nav header - Start -->

  <a href="https://docs.ballerine.com/">Documentation</a>
    ·
   <a href="https://join.slack.com/t/ballerine-oss/shared_invite/zt-1iu6otkok-OqBF3TrcpUmFd9oUjNs2iw">Slack</a>
    ·
    <a href="https://www.ballerine.com/">Website</a>
    ·
    <a href="#contact-ballerine">Contact</a>
    ·
    <a href="https://github.com/ballerine-io/ballerine/issues">Issues</a>
<!-- Nav header - END -->

<!-- Badges - Start -->
   <a href="https://github.com/ballerine-io/ballerine/stargazers"><img src="https://img.shields.io/github/stars/ballerine-io/ballerine?logo=GitHub&style=flat-square"></a> <a href="https://discord.gg/e2rQE4YygA"><img src="https://img.shields.io/website?color=%237289DA&down_color=%237289DA&down_message=Join&label=Discord&logo=discord&logoColor=white&style=flat-square&up_color=%237289DA&up_message=Join&url=https%3A%2F%2Fdiscord.gg%2Fe2rQE4YygA"></a> <a href="https://join.slack.com/t/ballerine-oss/shared_invite/zt-1iu6otkok-OqBF3TrcpUmFd9oUjNs2iw"><img src="https://img.shields.io/website?color=%23441949&down_color=%23441949&down_message=Join&label=Slack&logo=slack&logoColor=white&style=flat-square&up_color=%23441949&up_message=Join&url=https%3A%2F%2Fjoin.slack.com%2Ft%2Fballerine-oss%2Fshared_invite%2Fzt-1iu6otkok-OqBF3TrcpUmFd9oUjNs2iw"></a> <a href="https://twitter.com/ballerine_io"><img src="https://img.shields.io/website?color=%231DA1F2&down_color=%231DA1F2&down_message=Follow&label=Twitter&logo=twitter&logoColor=%231DA1F2&style=flat-square&up_color=%231DA1F2&up_message=%40ballerine.io&url=https%3A%2F%2Ftwitter.com%2FBallerine_io"></a> <a href="https://ycombinator.com"><img src="https://img.shields.io/website?color=%23f26522&down_message=Y%20Combinator&label=Backed&logo=ycombinator&style=flat-square&up_message=Y%20Combinator&url=https%3A%2F%2Fwww.ycombinator.com"></a>

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)
[![GitHub release](https://img.shields.io/github/v/release/ballerine-io/ballerine?label=last-release&style=flat-square)](https://github.com/ballerine-io/ballerine/releases)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/ballerine-io/ballerine/ci.yml?label=CI&style=flat-square)](https://github.com/ballerine-io/ballerine/actions/workflows/ci.yml)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/ballerine-io/ballerine/release.yml?label=Release&style=flat-square)](https://github.com/ballerine-io/ballerine/actions/workflows/release.yml)

</p>

<!-- Badges - END -->

</div>

Ballerine is an Open-Source Risk Management Infrastructure that helps global payment companies, marketplaces and Fintechs to automate their decisions for merchant, sellers and users throughout the customer lifecycle.
From account-opening (KYC, KYB), underwriting, and transaction monitoring, using a flexible rules & workflow engine, 3rd party plugin system, manual review back office, and document & information collection frontend flows.

<br/>

## Modules
- [**Back Office**](https://docs.ballerine.com/en/learn/case_management_overview) - Case management dashboard for manual decision-making.
- **Workflow Engine** - Orchestrates and automates the different system's parts.
- [**KYB Collection Flow**](#modules) - Real-time modification of KYC/KYB frontend user journeys.
- [**Rule Engine**](#modules) - Leverage various rule types to ensure user compliance with your risk policy.
- [**Plugin System**](#modules) - Integrates with 3rd-party vendors, APIs, and databases.  [see plugins](#modules).
- **No-Code Builder** - Leverage various rule types to ensure user compliance with your risk policy - 🚧 WIP.

## Why Open Source?
We believe in enabling companies to manage user  identity  and risk according to their unique  and evolving requirements. Ballerine empowers you to  create decisioning processes that are  right  for you. It is flexible, future-proof, easy to implement, secure, and supported by a robust community.

#### Explore What You Can Do With Ballerine
- **Dynamic Experience:** Adaptive user journeys that modify in real-time based on the user's risk.
- **Data Ownership:** Self-host on-premise to keep sensitive data within your infrastructure.
- **Global Orchestration:** Add/change vendors and data sources to cater to users from multiple countries.
- **Cost Reduction:** Retain control over vendor relationships, costs, and communication.
- And More.

## Try Ballerine Now

**In the following example you can test a simple form of the following infrastructure capabilities**

1. Document collection flow.
2. A manual review case management **Back Office**.
3. Live communication between the parts using a **Workflow Engine**, that also defines the process steps.
4. A simple JSON containing **Risk Rules** that are checked during the flow.

**Parts of the system you might look for but are not in THIS demo:**
- Our Rule Engine is still under construction and will soon be released.

**Getting started**
To set up a local environment, follow these steps:
1. #### Install prerequisites:
   - Node.js ([Install NVM](https://github.com/nvm-sh/nvm))
   - Latest PNPM version ([Install PNPM](https://pnpm.io/installation))
   - Docker and docker compose ([Docker](https://docs.docker.com/desktop), [Docker Compose](https://docs.docker.com/compose/install))

2. #### Clone and install the project:
  1. Clone the project:
   ```sh
   git clone https://github.com/ballerine-io/ballerine.git
   ```
  2. Install npm dependencies:
   ```sh
   pnpm install
   ```
  3. Initialize monorepo:
   ```sh
   pnpm monorepo:init
   ```
3. #### Run an example
   * KYB
   ```sh
   pnpm kyb-manual-review-example
   ```
   * KYC
    ```sh
   pnpm kyc-manual-review-example
   ```
Once the process is complete,  _2 tabs_   will open in your browser:
1. http://localhost:5201/ - for the _KYB document collection flow_
   OR http://localhost:5202 - for the _KYC document collection flow_
2. http://localhost:5137/ - for the  _backoffice_
   (See username/password below, It's recommended to have them positioned side-by-side).

   <sub>If the required tabs have not opened automatically, please use the links we have provided above.</sub>

   **Steps to go over the flow:**

1.  Go to the Backoffice tab to review the new user that was created
   1.1. Sign-in with the following credentials:
      - **Email:** `admin@admin.com`
      - **Password:** `admin`
   1.2. Under the business menu, choose "KYB with UBOs" to view the list of cases currently undergoing.
2.  On the Collection flow, fill in the required fields on each step.
3.  Go through and complete the flow. As you go through the collection flow, you should see the progress in the Backoffice case.
4.  Once the collection flow is finished, you can see the new state is "manual review," Assign the case to yourself, and then you will be able to choose to Approve, Reject, or Ask to Resubmit.
5.  Ask to resubmit a document, go back to the collection flow to re-upload, then go back to the Backoffice to see the updated information.

* Note: some components are currently in beta, if you run into an issue please ping us on Slack

## Contributing

We appreciate all types of contributions and believe that an active community is the secret to a rich and stable product.
Here are some of the ways you can contribute:

-   Give us feedback in our  [Slack community](https://join.slack.com/t/ballerine-oss/shared_invite/zt-1iu6otkok-OqBF3TrcpUmFd9oUjNs2iw)
-   Help with bugs and features on [our Issues page](https://github.com/ballerine-io/ballerine/issues)
-   Submit a  [feature request](https://github.com/ballerine-io/ballerine/issues/new?assignees=&labels=enhancement%2C+feature&template=feature_request.md)  or  [bug report](https://github.com/ballerine-io/ballerine/issues/new?assignees=&labels=bug&template=bug_report.md)

## Contact Ballerine
To start using the paid version or if you need any assistance, reach out to us at oss@ballerine.com. Join our [Discord Channel](https://discord.gg/e2rQE4YygA) and [Slack Channel](https://join.slack.com/t/ballerine-oss/shared_invite/zt-1iu6otkok-OqBF3TrcpUmFd9oUjNs2iw) to stay updated and engage with our community.
