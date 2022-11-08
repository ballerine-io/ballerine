<script lang="ts">
  import { onDestroy } from 'svelte';
  import { T } from '../contexts/translation';
  import { Image, Button, Title, IconCloseButton } from '../atoms';
  import { configuration } from '../contexts/configuration';
  import { Elements } from '../contexts/configuration/types';
  import { makeStylesFromConfiguration } from '../utils/css-utils';
  import ErrorText from '../atoms/ErrorText/ErrorText.svelte';
  import { EActionNames, sendButtonClickEvent, sendFlowCompleteEvent, EVerificationStatuses } from '../utils/event-service';
  import { flowDeclined } from '../services/analytics';
  import { currentParams, appState } from '../contexts/app-state';
  import { declineStep, layout } from '../default-configuration/theme';
  import merge from 'lodash.merge';
  import { DecisionStatus } from '../contexts/app-state/types';

  export let stepId;

  const step = merge(declineStep, $configuration.steps[stepId]);
  const stepNamespace = step.namespace!;
  const style = makeStylesFromConfiguration(merge(layout, $configuration.layout), step.style);

  const handleClose = () => {
    sendFlowCompleteEvent({ status: EVerificationStatuses.COMPLETED, idvResult: DecisionStatus.DECLINED });
  };

  onDestroy(() => {
    $currentParams = null;
  });

  flowDeclined();
</script>

<div class="container" {style}>
  {#each step.elements as element}
    {#if element.type === Elements.IconCloseButton}
      <IconCloseButton
        configuration={element.props}
        on:click={() => {
          sendButtonClickEvent(EActionNames.CLOSE, { status: EVerificationStatuses.DATA_COLLECTION }, $appState, true);
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
    {#if element.type === Elements.ErrorText}
      <ErrorText configuration={element.props}>
        <T key="description" namespace={stepNamespace} />
      </ErrorText>
    {/if}
    {#if element.type === Elements.Button}
      <Button configuration={element.props} on:click={handleClose}>
        <T key="button" namespace={stepNamespace} />
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
