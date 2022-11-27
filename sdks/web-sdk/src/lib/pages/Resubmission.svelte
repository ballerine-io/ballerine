<script lang="ts">
  import { T } from '../contexts/translation';
  import { Image, Button, Title, IconCloseButton } from '../atoms';
  import { configuration, Steps } from '../contexts/configuration';
  import { currentStepId, currentParams, appState } from '../contexts/app-state';
  import { Elements } from '../contexts/configuration/types';
  import ErrorText from '../atoms/ErrorText/ErrorText.svelte';
  import { flowResubmission } from '../services/analytics';
  import { onDestroy } from 'svelte';
  import {
    EActionNames,
    sendButtonClickEvent,
    EVerificationStatuses,
  } from '../utils/event-service';
  import { getLayoutStyles, getStepConfiguration, uiPack } from '../ui-packs';
  import { getFlowConfig } from '../contexts/flows/hooks';

  export let stepId;

  const step = getStepConfiguration($configuration, $uiPack, stepId);
  const flow = getFlowConfig($configuration);
  const style = getLayoutStyles($configuration, $uiPack, step);

  const stepNamespace = step.namespace!;
  const hasDocumentSelection = !!($configuration.steps && $configuration.steps[Steps.DocumentSelection]) && !!$uiPack.steps[Steps.DocumentSelection];


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
            EActionNames.CLOSE,
            { status: EVerificationStatuses.DATA_COLLECTION },
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
