---
title: Workflow Definitions
description: Workflow Definitions

---

A workflow definition is a JSON object that specifies the structure and behavior of a workflow. It outlines the states, transitions, actions, and events that the workflow is comprised of. 

## Components of a Workflow Definition

Let's explore the main components that make up a workflow definition:

### States

States represent different conditions that your system or process could be in. For example, `idle`, `check_business_details`, `manual_review`, and so on. States provide a snapshot of the system at any given time.

### Transitions

Transitions define the conditions that allow the system to move from one state to another. They are linked to actions or events and are expressed using `on` in the statechart. Transitions determine the path of the process based on various conditions.

### Actions

Actions are side effects or operations that are carried out when transitioning from one state to another. These could include API calls, sending messages, updating the system state, etc. They represent the active parts of your workflows.

### Events

Events are the triggers that cause transitions to occur. In our workflows, events can be user actions or system events, such as API responses. Events are the stimuli to which the system responds by changing states.

For a detailed understanding of how states and state configuration work in XState, please refer to the [XState documentation](https://xstate.js.org/docs/guides/states.html).


---
