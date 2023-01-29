<script lang="ts">
  import { onDestroy } from 'svelte';
  import { T } from '../contexts/translation';
  import { Button, IconButton, IconCloseButton, Image, Paragraph, Title } from '../atoms';
  import { configuration } from '../contexts/configuration';
  import { appState, currentParams } from '../contexts/app-state';
  import { Elements } from '../contexts/configuration/types';
  import { flowApproved } from '../services/analytics';
  import {
    ActionNames,
    sendButtonClickEvent,
    sendFlowCompleteEvent,
    VerificationStatuses,
  } from '../utils/event-service';
  import { DecisionStatus } from '../contexts/app-state/types';
  import { getLayoutStyles, getStepConfiguration } from '../ui-packs';
  import { getFlowConfig } from '../contexts/flows/hooks';

  export let stepId;

  const step = getStepConfiguration($configuration, stepId);
  const flow = getFlowConfig($configuration);
  const style = getLayoutStyles($configuration, step);

  const stepNamespace = step.namespace!;

  flowApproved();

  const handleClose = () => {
    sendFlowCompleteEvent({
      status: VerificationStatuses.COMPLETED,
      idvResult: DecisionStatus.APPROVED,
    });
  };

  onDestroy(() => {
    $currentParams = null;
  });
</script>

<div class="container" {style}>
  {#each step.elements as element}
    {#if element.type === Elements.IconButton}
      <IconButton configuration={element.props} />
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
    {#if element.type === Elements.Image}
      <Image configuration={element.props} />
    {/if}
    {#if element.type === Elements.Title}
      <Title configuration={element.props}>
        <T key="title" namespace={stepNamespace} />
      </Title>
    {/if}
    {#if element.type === Elements.Paragraph}
      <Paragraph configuration={element.props}>
        <T key={element.props.context || 'description'} namespace={stepNamespace} />
      </Paragraph>
    {/if}
    {#if element.type === Elements.Button}
      <Button on:click={handleClose} configuration={element.props}>
        <T key="button" namespace={stepNamespace} />
      </Button>
    {/if}
  {/each}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    padding: var(--padding);
    position: relative;
    background: var(--background);
    text-align: center;
    height: 100%;
  }
</style>
