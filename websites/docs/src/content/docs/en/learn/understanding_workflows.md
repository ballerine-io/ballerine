---
title: Understanding Workflows
description: Understanding Workflows

---

A workflow, in a broad sense, is a series of steps or a process that takes an input and produces an output. It's a sequence of tasks or procedures that lead to some desired outcome. However, in the context of our system, workflows are not just mere sequences but orchestrated, complex processes that involve dynamic decision-making and interactions. A good example is the "Know Your Business (KYB)" process, as explained in our [KYB guide](/en/learn/simple_kyb_guide).

## What are Workflows in Our System?

In our system, workflows are defined using a State Machine model, specifically statecharts, which is implemented using the [XState library](https://xstate.js.org/docs/). In the realm of state machines, a system can be in only one state at a time. From that state, certain actions or events can lead the system to transition to other states.

Statecharts allow you to define complex behavior using states, sub-states, and transitions between states. It's a robust way to manage and visualize the different stages of a process and the conditions that lead to state changes.

States and transitions in our workflows are predefined and loaded into the system during startup. They define the blueprints of different processes within our system.


---
