<script lang="ts">
  import { onDestroy } from 'svelte';
  import { T } from '../contexts/translation';
  import { Image, Button, Title } from '../atoms';
  import { configuration, Steps } from '../contexts/configuration';
  import { Elements } from '../contexts/configuration/types';
  import { makeStylesFromConfiguration } from '../utils/css-utils';
  import ErrorText from '../atoms/ErrorText/ErrorText.svelte';
  import { DecisionStatus, sendFlowCompleteEvent } from '../utils/event-service';
  import { flowDeclined } from '../services/analytics';
  import { addCloseToURLParams } from '../contexts/navigation/hooks';
  import { currentParams } from '../contexts/app-state';
  import { declineStep, layout } from '../default-configuration/theme';
  import merge from 'lodash.merge';

  const step = merge(declineStep, $configuration.steps[Steps.Decline]);
  const style = makeStylesFromConfiguration(merge(layout, $configuration.layout), step.style);

  const handleClose = () => {
    sendFlowCompleteEvent({ status: 'completed', idvResult: DecisionStatus.DECLINED });
    addCloseToURLParams();
  };

  onDestroy(() => {
    $currentParams = null;
  });

  flowDeclined();
</script>

<div class="container" {style}>
  {#each step.elements as element}
    {#if element.type === Elements.Image}
      <Image configuration={element.props} />
    {/if}
    {#if element.type === Elements.Title}
      <Title configuration={element.props}>
        <T key="title" module="decline" />
      </Title>
    {/if}
    {#if element.type === Elements.ErrorText}
      <ErrorText configuration={element.props}>
        <T key="description" module="decline" />
      </ErrorText>
    {/if}
    {#if element.type === Elements.Button}
      <Button configuration={element.props} on:click={handleClose}>
        <T key="button" module="decline" />
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
