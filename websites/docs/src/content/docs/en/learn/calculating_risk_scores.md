---
title: Calculating Risk Scores
description: A guide on configuring risk score calculations in workflows using plugins in Ballerine.
---

In Ballerine, you can attach a plugin to a workflow state to perform risk evaluations. This is done by specifying the states where risk calculations should occur and the source of the rules for these calculations.

### Example Configuration

Here is an example configuration for calculating risk rules using a plugin:

```json
{
  "name": "risk_evaluation",
  "pluginKind": "riskRules",
  "stateNames": [
    "manual_review",
    "calculate_risk"
  ],
  "rulesSource": {
    "source": "notion",
    "databaseId": "ef017053c5fc418383ff3489d8f3e02b"
  }
}

```

### Explanation

1. **Name (`name`)**:
    - The name of the plugin, in this case, `risk_evaluation`.
2. **Plugin Kind (`pluginKind`)**:
    - Specifies the type of plugin. For risk calculations, this is `riskRules`.
3. **State Names (`stateNames`)**:
    - An array of states where risk calculations should be performed. In this example, the risk evaluation will be applied in the `manual_review` and `calculate_risk` states.
    - These states are typically those where you want to present risk evaluations in the case management system.
4. **Rules Source (`rulesSource`)**:
    - **Source (`source`)**: Indicates where the risk calculation rules are sourced from. This can be an internal database or an external source like Notion.
    - **Database ID (`databaseId`)**: The ID of the database where the rules are stored. This allows for flexibility, enabling clients to add their own custom calculations.


<img title="Scores" alt="Scores" src="https://uploads-ssl.webflow.com/62a3bad46800eb4715b2faf1/669ef83dd564782c92c23d05_Screenshot%202024-07-23%20at%203.17.14.png">
  