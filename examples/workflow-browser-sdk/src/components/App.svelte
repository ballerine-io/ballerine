<script lang="ts">
  import type { WorkflowOptionsBrowser } from "@ballerine/workflow-browser-sdk";
  import { onMount } from "svelte";
  import { fetchJson, handlePromise, makeWorkflow } from "../utils";
  import Workflow from "./Workflow.svelte";

  let workflow: WorkflowOptionsBrowser;
  let renderIntentButton = false;

  const fetchWorkflows = async () =>
  fetchJson<
      Array<{
        id: string;
        workflowDefinitionId: string;
        status: "completed" | "created";
      }>
    >(`http://localhost:3000/api/external/workflows`);
  const fetchWorkflow = async (id: string) =>
  fetchJson(`http://localhost:3000/api/external/workflows/${id}`);
  const handleWorkflow = async () => {
    const [workflows] = await handlePromise(fetchWorkflows());

    const firstWorkflow = workflows?.find(
      (workflow) =>
        workflow?.workflowDefinitionId?.startsWith("COLLECT_DOCS") &&
        workflow?.status !== "completed"
    );

    if (!firstWorkflow) {
      renderIntentButton = true;

      return;
    }

    const [data, error] = await handlePromise(fetchWorkflow(firstWorkflow?.id));

    if (error) throw error;
    if (!data) return;

    workflow = makeWorkflow(data);
    renderIntentButton = false;
  };
  const handleIntent = async () => {
    const data = await fetchJson<Array<Record<string, unknown>>>(
      `http://localhost:3000/api/external/workflows/intent`,
      {
        method: "POST",
        body: { intentName: "kyc" },
      }
    );

    workflow = makeWorkflow(data?.[0]);
    renderIntentButton = false;
  };

  onMount(async () => {
    await handleWorkflow();
  });
</script>

{#if workflow}
  <Workflow {workflow} />
{/if}
{#if renderIntentButton}
  <button on:click={handleIntent}>KYC</button>
{/if}
