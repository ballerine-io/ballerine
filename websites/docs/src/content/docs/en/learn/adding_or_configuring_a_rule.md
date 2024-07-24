---
title: Adding/configuring a rule
description: A guide on how to add or configure rules in a workflow.
---

# Adding/configuring a rule

To add more rules or modify existing ones, follow the structure provided and adjust the conditions and targets as needed:

```
json
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

In this modified example, the workflow will be auto-rejected if the MCC code is 0742 and the country is the US. Otherwise, it will continue to the `get_vendor_data` state.

By defining transition rules, you can control the flow of your workflows based on specific conditions, ensuring automated and efficient processing.
