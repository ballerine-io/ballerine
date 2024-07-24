---
title: Understanding workflows technology
description: Overview of how our system uses state machines with the XState library to manage workflows effectively.
---

# Understanding workflows technology

Workflows in our system are built on top of state machines, specifically using the [XState library](https://xstate.js.org/docs/). These workflows orchestrate flows within the system, both on the backend and frontend. They are designed with an integrated plugin system, customizable templates, and durable executions.

### Why state machines?

In our system, workflows are defined using a State Machine model, specifically statecharts, which is implemented using the [XState library](https://xstate.js.org/docs/). In the realm of state machines, a system can be in only one state at a time. From that state, certain actions or events can lead the system to transition to other states.

Statecharts allow the definition of complex behavior using states, sub-states, and transitions between states. It's a robust way to manage and visualize the different stages of a process and the conditions that lead to state changes.
