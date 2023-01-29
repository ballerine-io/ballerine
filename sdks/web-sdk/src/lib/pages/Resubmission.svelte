<script lang="ts">
  import { T } from '../contexts/translation';
  import { Button, IconCloseButton, Image, Title } from '../atoms';
  import { configuration } from '../contexts/configuration';
  import { appState, currentParams, currentStepId } from '../contexts/app-state';
  import { Elements } from '../contexts/configuration/types';
  import ErrorText from '../atoms/ErrorText/ErrorText.svelte';
  import { flowResubmission } from '../services/analytics';
  import { onDestroy } from 'svelte';
  import { ActionNames, sendButtonClickEvent, VerificationStatuses } from '../utils/event-service';
  import { getLayoutStyles, getStepConfiguration } from '../ui-packs';
  import { getFlowConfig } from '../contexts/flows/hooks';
  import { isDocumentSelectionStepExists } from '../utils/documents-utils';

  export let stepId;

  const step = getStepConfiguration($configuration, stepId);
  const flow = getFlowConfig($configuration);
  const style = getLayoutStyles($configuration, step);

  const stepNamespace = step.namespace!;
  const hasDocumentSelection = isDocumentSelectionStepExists($configuration);

  const reasonCode = $currentParams ? $currentParams.reasonCode : null;

  const handleNavigate = () => {
    if (hasDocumentSelection) {
      $currentStepId = 'select-document';
      return;
    }
    $currentStepId = 'document-start';
  };

  onDestroy(() => {
    $currentParams = null;
  });

  flowResubmission();
</script>

<div class="container" {style}>
  {#each step.elements as element}
    {#if element.type === Elements.Image}
      <Image configuration={element.props} />
    {/if}
    {#if element.type === Elements.IconCloseButton && flow.showCloseButton}
      <IconCloseButton
        configuration={element.props}
        on:click={() => {
          sendButtonClickEvent(
            ActionNames.CLOSE,
            { status: VerificationStatuses.DATA_COLLECTION },
            $appState,
            true,
          );
        }}
      />
    {/if}
    {#if element.type === Elements.Title}
      <Title configuration={element.props}>
        <T key={`${reasonCode}-title`} namespace={stepNamespace} />
      </Title>
    {/if}
    {#if element.type === Elements.ErrorText}
      <ErrorText configuration={element.props}>
        <T key={`${reasonCode}-description`} namespace={stepNamespace} />
      </ErrorText>
    {/if}
    {#if element.type === Elements.Button}
      <Button configuration={element.props} on:click={handleNavigate}>
        <T key={`${reasonCode}-button`} namespace={stepNamespace} />
      </Button>
    {/if}
  {/each}
</div>

<style>
  .container {
    padding: var(--padding);
    position: relative;
    background: var(--background);
    text-align: center;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
