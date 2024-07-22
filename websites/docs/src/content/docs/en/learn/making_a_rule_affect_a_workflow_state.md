# Making a rule affect a workflow state

### Transition Rules

When building a workflow, you can add rules on events to determine the next state. For example, you can set a rule on an MCC code to auto-approve, auto-reject, or move to manual review. Ballerine supports multiple rule engines to define these rules. Below is an example using the JSON Logic rule engine.

### Example: JSON Logic Rule Engine

The following example demonstrates how to set a rule that auto-rejects a workflow if the customer has an MCC code of 0742. If the condition is not met, the workflow continues as usual.

```json
"collection_flow": {
  "on": {
    "COLLECTION_FLOW_FINISHED": [
      {
        "cond": {
          "type": "json-logic",
          "options": {
            "rule": {
              "in": [
                {
                  "var": "entity.data.additionalInfo.store.mcc"
                },
                [
                  "0742"
                ]
              ]
            }
          }
        },
        "target": "rejected"
      },
      {
        "target": "get_vendor_data"
      }
    ]
  },
  "tags": [
    "collection_flow"
  ]
}

```

### Explanation

1. **Event Handling (`on`)**:
    - The `COLLECTION_FLOW_FINISHED` event triggers the transition rules.
2. **Condition (`cond`)**:
    - **Type (`type`)**: Specifies the type of rule engine, in this case, `json-logic`.
    - **Options (`options`)**: Contains the logic rule to be evaluated.
        - **Rule (`rule`)**: The JSON Logic rule to be applied.
            - **`in`**: Checks if the value of `entity.data.additionalInfo.store.mcc` is in the array `["0742"]`.
            - **`var`**: Retrieves the value from the workflow context, in this case, the MCC code.
3. **Targets (`target`)**:
    - If the condition is met (MCC code is 0742), the workflow transitions to the `rejected` state.
    - If the condition is not met, the workflow transitions to the `get_vendor_data` state.
4. **Tags (`tags`)**:
    - Tags can be used to categorize or organize different parts of the workflow.

### Customizing Transition Rules

You can customize the transition rules to fit your specific workflow requirements. By using different conditions and targets, you can create a flexible and dynamic workflow that responds to various events and data inputs.

### Adding New Rules

To add more rules or modify existing ones, you can follow the structure provided and adjust the conditions and targets as needed:

```
"collection_flow": {
  "on": {
    "COLLECTION_FLOW_FINISHED": [
      {
        "cond": {
          "type": "json-logic",
          "options": {
            "rule": {
              "and": [
                {
                  "in": [
                    {
                      "var": "entity.data.additionalInfo.store.mcc"
                    },
                    [
                      "0742"
                    ]
                  ]
                },
                {
                  "==": [
                    {
                      "var": "entity.data.country"
                    },
                    "US"
                  ]
                }
              ]
            }
          }
        },
        "target": "rejected"
      },
      {
        "target": "get_vendor_data"
      }
    ]
  },
  "tags": [
    "collection_flow"
  ]
}
```

[![Case Management](https://uploads-ssl.webflow.com/62a3bad46800eb4715b2faf1/669eeceed5f0d99c51777ae4_image%20136.png)](https://www.loom.com/share/6a1c6331309644d7ac49492e7047f2ae?sid=c1e6ec02-e734-4960-8358-5976942a7256)
