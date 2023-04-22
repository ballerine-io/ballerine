<div align="center">

<a href="https://ballerine.com" title="Ballerine - Open-source Infrastructure for Identity and Risk management.">
    <img src="https://blrn-staging-assets.s3.eu-central-1.amazonaws.com/git-header-black.png" alt="Ballerine's website">
</a>

## Open-Source Rules & Workflow Engine for User Identity and Risk Decisioning

</br>
  <!-- Nav header - Start -->

<a href="https://join.slack.com/t/ballerine-oss/shared_invite/zt-1iu6otkok-OqBF3TrcpUmFd9oUjNs2iw">Slack</a>
·
<a href="https://www.ballerine.com/">Website</a>
·
<a href="https://github.com/ballerine-io/ballerine/issues">Issues</a>

<!-- Nav header - END -->

<!-- Badges - Start -->

<a href="https://github.com/ballerine-io/ballerine/stargazers"><img src="https://img.shields.io/github/stars/ballerine-io/ballerine?logo=GitHub&style=flat-square"></a>
<a href="https://discord.gg/e2rQE4YygA"><img src="https://img.shields.io/website?color=%237289DA&down_color=%237289DA&down_message=Join&label=Discord&logo=discord&logoColor=white&style=flat-square&up_color=%237289DA&up_message=Join&url=https%3A%2F%2Fdiscord.gg%2Fe2rQE4YygA"></a>
<a href="https://join.slack.com/t/ballerine-oss/shared_invite/zt-1iu6otkok-OqBF3TrcpUmFd9oUjNs2iw"><img src="https://img.shields.io/website?color=%23441949&down_color=%23441949&down_message=Join&label=Slack&logo=slack&logoColor=white&style=flat-square&up_color=%23441949&up_message=Join&url=https%3A%2F%2Fjoin.slack.com%2Ft%2Fballerine-oss%2Fshared_invite%2Fzt-1iu6otkok-OqBF3TrcpUmFd9oUjNs2iw"></a>
<a href="https://twitter.com/ballerine_io"><img src="https://img.shields.io/website?color=%231DA1F2&down_color=%231DA1F2&down_message=Follow&label=Twitter&logo=twitter&logoColor=%231DA1F2&style=flat-square&up_color=%231DA1F2&up_message=%40ballerine.io&url=https%3A%2F%2Ftwitter.com%2FBallerine_io"></a>
<a href="https://ycombinator.com"><img src="https://img.shields.io/website?color=%23f26522&down_message=Y%20Combinator&label=Backed&logo=ycombinator&style=flat-square&up_message=Y%20Combinator&url=https%3A%2F%2Fwww.ycombinator.com"></a>
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)
[![GitHub release](https://img.shields.io/github/v/release/ballerine-io/ballerine?label=last-release&style=flat-square)](https://github.com/ballerine-io/ballerine/releases)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/ballerine-io/ballerine/ci.yml?label=CI&style=flat-square)](https://github.com/ballerine-io/ballerine/actions/workflows/ci.yml)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/ballerine-io/ballerine/release.yml?label=Release&style=flat-square)](https://github.com/ballerine-io/ballerine/actions/workflows/release.yml)

</p>
<!-- Badges - END -->

</div>

## Description

Ballerine's flexible open-source rules & workflow engine helps companies automate their decisions on which customer to serve and how.

With Ballerine you can build custom account-opening, underwriting, and transaction monitoring decisioning processes, using a flexible open-source rules & workflow engine that can control real-time changes in your user experience, enrich data using 3rd parties, call custom APIs, escalate tasks to your back-office, and more.

### What you can find in this project

- :twisted_rightwards_arrows: **Workflow engine** - :white_check_mark: Public beta

  - Automate decisions based on user data, 3rd party input and rules.

- :scroll: **Rule engine** - :male_detective: Private Beta (collaborators)

  - Use different rule types to determine when and how to serve customers.

- :electric_plug: **Plugin system** - :closed_lock_with_key: Private Alpha

  - Utilize our plugin system and unified API to connect to 3rd party vendors, custom APIs and databases.

- :video_game: **Frontend headless SDK** - :white_check_mark: Public beta
  1. Control the journey of your users in real-time, based on their updating attributes.
  1. Onboarding building blocks (community-driven kit) - [Go to directory](https://github.com/ballerine-io/ballerine/blob/main/websites/docs/src/pages/en/learn/kit.md)
     _ KYC/KYB/doc collection flows and UI via Mobile & web SDK
     _ Case management dashboard for users approval
     </br>

## Getting started

Set up an onboarding decisioning workflow using Ballerina's pre-built building blocks. Collect data from users, process it with third-party vendors, automate decisions, or send them for manual review in the back office.

### Local Environment Setup

#### Prerequisites:

- Install Node.js ([Install NVM](https://github.com/nvm-sh/nvm))
- Install the latest PNPM version ([Install PNPM](https://pnpm.io/installation))
- Install docker and docker compose ([Docker](https://docs.docker.com/desktop), [Docker Compose](https://docs.docker.com/compose/install))

#### Install:

1.  Clone the project:

```sh
git clone https://github.com/ballerine-io/ballerine.git
```

2.  Install npm depenencies:

```sh
pnpm install
```

3.  Initilazie monorepo:

```sh
pnpm monorepo:init
```

#### Run Examples:

##### KYC Manual Review Workflow:

The following command will run the workflow's backend (workflow service API), the backoffice, and UI example using the headless web SDK:

```sh
pnpm kyc-manual-review-example
```

Once the process is complete, _2 tabs_ will open in your browser:
the _backffice_ and the _example KYC UI_
(It's recommended to have them positioned side-by-side).

**Steps to go over the flow:**

1. On the KYC UI, click the "Start KYC" button
2. Go through and complete the flow
3. Go to the backoffice tab to review the new user that was created
4. Approve/reject/ask to resubmit
5. Get back to the KYC UI to see the result

\*Note: most components are currently in beta, if you run into an issue please ping us on [Slack](<[https://join.slack.com/t/ballerine-oss/shared_invite/zt-1iu6otkok-OqBF3TrcpUmFd9oUjNs2iw](https://join.slack.com/t/ballerine-oss/shared_invite/zt-1iu6otkok-OqBF3TrcpUmFd9oUjNs2iw)>)

#### Development mode:

- _Run in development mode_ - runs all the projects in dev mode:

```sh
pnpm dev
```

---

Join our mailing list so you know whenever we release new products and features.

<a href="https://www.ballerine.com/" title="Ballerine - Request Access">
    <img width="160px" src="https://blrn-staging-assets.s3.eu-central-1.amazonaws.com/email-updates.png" alt="Ballerine's Early Access">
</a>

---

### Why Open Source Workflow Engine?

Our goal is to enable companies to manage user identity and risk according to their unique and evolving requirements.
With Ballerine's workflow engine you can create the decisioning processes right for you.

- **Flexible** - limitless building capabilities using code to address any use case.
- **Future proof** - adaptable to future needs using custom code, creating new features, and integrating external systems.
- **Short to Implement** - enables developers to easily integrate it into their existing tech stack independently.
- **Secure** - adhere to your security & privacy protocols through on-prem deployment, self-hosting, and data ownership.
- **Community** - use what others have built, contribute yourself, and leverage community maintenance.

<details>

<summary>Examples of what you can do with it:</summary>

- Dynamic experience - build journeys that change mid-flow based on the current understanding of the user's risk.
- Data ownership - run the process self-hosted on prem to keep sensitive data in-house
- Global Orchestration - change/add vendors easily to support users from multiple countries.
- Cost reduction - leverage ownership of vendor relationships to maintain control over costs and communication.
- And more.

</details>

# Rule & Workflow Engine

Define and automate complex decisioning processes for your unique business needs, in a flexible and customizable dev-friendly infrastructure using Ballerine’s rules and workflow engine.

- Trigger actions to enrich data and uncover risk, and streamline your team's decision-making process.
- Visualize complex flows to provide observability of how things work to the rest of the company.
- Improve compliance, reduce fraud, and increase conversion.

<br/>

<img src="https://blrn-staging-assets.s3.eu-central-1.amazonaws.com/rule%20engine.png">

<br/>

# Onboarding building blocks (community-driven kit)

Use the community driven KYC/KYB process and back-office building blocks to form flows and start onboarding clients.

What's included:

- KYC/KYB flows and UI in Mobile & web SDK
- Case management dashboard for users approval

To get started go to [Onboarding building blocks](https://github.com/ballerine-io/ballerine/blob/main/websites/docs/src/pages/en/learn/kit.md) directory.

<sub>\* Please note that, although we regularly update it, Ballerine's "build your own KYC process" is a community offering and not our core product or service.
As such, we do not assume any responsibility for its use and do not consider it a part of our official services.</sub>
</br>
</br>
</br>

<p align="center">
Mobile & web SDK
<img src="https://blrn-staging-assets.s3.eu-central-1.amazonaws.com/phones.png">
</p>
</br>

<p align="center">
Case management dashboard
</p>

<p align="center">
<img src="https://blrn-imgs.s3.eu-central-1.amazonaws.com/github/dashboard.png">
</a>
</p>

Examples of what you can do with it:

- Use different vendors for different audiences - all modules are 100% vendor agnostic.
- Create your own low-cost KYC with AWS Rekognition, Google vision, and other ML tools.
- Collect documents in a KYB flow.
- Implement and modify a case management for user approval/rejection.
- And more.

---

#### Get to know whenever we release new stuff

Leave us your email on our mailing list and we'll let you know whenever we release a feature or improvement.

<a href="https://www.ballerine.com/" title="Ballerine - Request Access">
    <img width="160px" src="https://blrn-staging-assets.s3.eu-central-1.amazonaws.com/email-updates.png" alt="Ballerine's Early Access">
</a>
</br>

</br>
Or join our community channels:
</br>
</br>
<a href="https://discord.gg/e2rQE4YygA" title="Ballerine - Discord Channel">
<img height="18px" src="https://blrn-staging-assets.s3.eu-central-1.amazonaws.com/discord%20community.png" alt="Ballerine's Discord Channel"></a>
</br>
<a href="https://join.slack.com/t/ballerine-oss/shared_invite/zt-1iu6otkok-OqBF3TrcpUmFd9oUjNs2iw" title="Ballerine - Slack Channel">
<img height="18px" src="https://blrn-staging-assets.s3.eu-central-1.amazonaws.com/slack%20community.png" alt="Ballerine's Slack Channel"></a>
</br>

---

<i>As you can see, most apps and packages are still private beta. We are working on migrating them to this monorepo.</i>\
<i>If you already want to start using them or want to get involved - reach out to us at [oss@ballerine.com](mailto:oss@ballerine.com).</i>
