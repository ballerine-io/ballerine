<script lang="ts">
  import type {WorkflowOptionsBrowser} from "@ballerine/workflow-browser-sdk";
  import DocumentPhoto from "./DocumentPhoto.svelte";
  import DocumentSelection from "./DocumentSelection.svelte";
  import Dump from "./Dump.svelte";
  import ErrorComponent from "./Error.svelte";
  import Final from "./Final.svelte";
  import Resubmission from "./Resubmission.svelte";
  import Success from "./Success.svelte";
  import {type ObjectValues, State} from "@/types";
  import Welcome from "./Welcome.svelte";
  import {initWorkflowContext} from "@/utils";
  import DocumentReview from "./DocumentReview.svelte";

  const Step = {
    WELCOME: Welcome,
    DOCUMENT_SELECTION: DocumentSelection,
    DOCUMENT_PHOTO: DocumentPhoto,
    DOCUMENT_REVIEW: DocumentReview,
    FINAL: Final,
    ERROR: ErrorComponent,
    SUCCESS: Success,
    RESUBMISSION: Resubmission,
  } as const;
  export let workflow: WorkflowOptionsBrowser;
  let workflowService = initWorkflowContext(workflow);

  let snapshot = workflowService?.getSnapshot();
  let currentStep: string = snapshot?.machine?.initial ?? State.WELCOME;
  let step: ObjectValues<typeof Step> = Step[currentStep as keyof typeof Step];
  let stateActionStatus: "PENDING" | "ERROR" | "SUCCESS";
  let error: string;

  const onPrev = (payload: Record<PropertyKey, any>) => () => {
    workflowService.sendEvent({
      type: "USER_PREV_STEP",
      payload,
    });
  };
  const onSubmit = (payload: Record<PropertyKey, any>) => {
    workflowService.sendEvent({
      type: "USER_NEXT_STEP",
      payload,
    });
  };
  let initialValues = {
    documentOne: {
      type: snapshot?.context?.documentOne?.type,
    },
  };

  workflowService.subscribe("USER_NEXT_STEP", (data) => {
    currentStep = data.state;
  });

  workflowService.subscribe("USER_PREV_STEP", (data) => {
    currentStep = data.state;
  });

  workflowService.subscribe("ERROR", (payload) => {
    console.log("ERROR", payload);
    error = (payload.error as Error).message;
  });

  workflowService.subscribe("HTTP_ERROR", (payload) => {
    console.log("HTTP_ERROR", payload);
    error = payload.error.message;
  });

  workflowService.subscribe("STATE_ACTION_STATUS", (event) => {
    console.log("STATE_ACTION_STATUS", event);
    stateActionStatus = event?.payload?.status;
    error = (event?.error as Error)?.message;
  });

  $: {
    currentStep;
    step = Step[currentStep.toUpperCase() as keyof typeof Step];
    snapshot = workflowService?.getSnapshot();
    initialValues.documentOne.type = snapshot?.context?.documentOne?.type;
  }
</script>

{#if stateActionStatus === "PENDING"}
  Loading...
{/if}

{#if stateActionStatus === "ERROR"}
  {error}
{/if}

{#if stateActionStatus === "SUCCESS"}
  Success!
{/if}

<svelte:component this={step} {onPrev} {onSubmit} {initialValues} />

<Dump value={snapshot} />
<Dump value={initialValues} />
