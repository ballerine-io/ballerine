---
title: System Overview
description: An overview of Ballerine's risk management platform and its modules for building and managing custom risk flows.
---


Ballerine is a risk management platform for performing all types of risk flows and processes. To do so, Ballerine provides the risk modules needed to build custom risk flows. You can use all modules, combinations of some modules, or just one module to perform a desired risk process.

For example:
- **Build a full KYB flow** using data collection flow, 3rd party vendors, risk rules, and the case management.
- **Build a simple KYC** using 3rd party vendors, risk rules, and the case management.
- **Build a simple digital form** using data collection flow.
- **Manually review documents** using the case management.
-  Etc.

### Example flow using Ballerine's modules

<img title="Example workflow" alt="Example workflow" src="https://uploads-ssl.webflow.com/62a3bad46800eb4715b2faf1/669ea9cfe853bf03be6dcbc3_Workflow%20example.png">



## Workflows
A workflow is the engine that orchestrates the different steps of a risk flow, and how they should interact with each other.
Every workflow is a definition of a flow, made out of Ballerine's different modules.
Whenever a risk flow ("Customer Onboarding" for example) starts, the workflow that is assigned to that risk flow initiates and controls which module should be in use and when.

**Learn more about workflows**

[Understanding workflows technology](/en/learn/workflows_technology)

[Creating a workflow](/en/learn/creating_a_workflow)

[Configuring a workflow](/en/learn/configuring_a_workflow)

[Invoking a workflow / creating a case](/en/learn/invoking_a_workflow)


## Collection Flows
Ballerine's collection flow module enables you to collect information and documents from you end users, using customizable, white-label digital forms.
All of the steps and inputs are fully customizable, to enable building different types of flows.

**Learn more about collection flows**

[Configuring a collection flow](/en/learn/configuring_a_collection_flow)

[Changing the collection flow design](/en/learn/changing_the_collection_flow_design)


<img title="Collection Flow" alt="Collection Flow" src="https://uploads-ssl.webflow.com/62a3bad46800eb4715b2faf1/669eacfd54f5c71e9c9edb85_Collection%20flow%20example.png">




## Rules Engine
The Rules Engine applies risk rules to assign risk scores, present risk indicators, and automate decisions within workflows. It encompasses transition rules, risk calculation, and alerting mechanisms.

**Learn more about the rule engine**

[Making a rule affect a workflow state](/en/learn/adding_rules_and_affect_workflows)

[Calculation Risk Scores](/en/learn/calculating_risk_scores)

## Case Managment
The Case Management module provides a user interface for manual decision-making processes, such as approving, rejecting, or requesting re-submission of cases. It offers customizable layouts and information presentation, allowing users to efficiently handle and review cases.

**Learn more about case management**

[Overview of case management](/en/learn/case_management_overview)

[Using the case management dashboard](/en/learn/using_the_case_management_dashboard)

[Add and Customize Workflows in the Case Management](/en/learn/add_and_customize_workflows_in_the_case_management)


<img title="Case Management" alt="Case Management" src="https://uploads-ssl.webflow.com/62a3bad46800eb4715b2faf1/669eb373c7708310d2b4ac61_Case%20managment%20example.png">

## Unified API

Ballerine's unified API is integrated with third-party vendors, APIs, and data sources to enhance functionality and capabilities.

**Learn more about the unified API**

[Adding a 3rd Party check to a workflow](/en/learn/adding_a_3rd_party_check_to_a_workflow)

## Child Workflows
Child workflows allow for the generation and activation of extra side workflows (for example: generating multiple KYC flows for the UBOs provided mid-flow, or an extra KYB process for a parent company) and enable complex, nested processes within the main workflows.

**Learn more about child workflows**

[Adding a child workflow to your workflow](/en/learn/adding_a_child_workflow_to_your_workflow)

## Plugins

Ballerine's plugins enables deep integration with your existing systems, allowing for functionalities such as triggering flows through your CRM, integrating with pre-existing vendors, and displaying their information within Ballerine's platform.

**Learn more about plugins**

[Using Plugins](/en/learn/plugins)


## Webhooks
Webhooks in Ballerine allow for real-time communication and integration with external systems. They enable the system to send automated messages or information to other systems as events occur within Ballerine.

**Learn more about webhooks**

[Using webhooks](/en/learn/how_to_use_webhooks)
