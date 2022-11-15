<script lang="ts">
  import { T } from '../contexts/translation';
  import { Image, Button, Title, IconCloseButton } from '../atoms';
  import { configuration, Steps } from '../contexts/configuration';
  import { currentStepId, currentParams, appState } from '../contexts/app-state';
  import { Elements } from '../contexts/configuration/types';
  import { makeStylesFromConfiguration } from '../utils/css-utils';
  import ErrorText from '../atoms/ErrorText/ErrorText.svelte';
  import { flowResubmission } from '../services/analytics';
  import { onDestroy } from 'svelte';
  import merge from 'deepmerge';
  import { layout, resubmissionStep } from '../default-configuration/theme';
  import { mergeStepConfig } from '../services/merge-service';
  import { injectPrimaryIntoLayoutGradient } from '../services/theme-manager';
  import {
    EActionNames,
    sendButtonClickEvent,
    EVerificationStatuses,
  } from '../utils/event-service';
  import { getFlowConfig } from '../contexts/flows/hooks';

  export let stepId;

  const step = mergeStepConfig(resubmissionStep, $configuration.steps[stepId]);

  const flow = getFlowConfig($configuration);

  const stepNamespace = step.namespace!;
  const hasDocumentSelection = !!$configuration.steps[Steps.DocumentSelection];

  const style = makeStylesFromConfiguration(
    merge(
      injectPrimaryIntoLayoutGradient(layout, $configuration.general.colors.primary),
      $configuration.layout || {},
    ),
    step.style,
  );

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
