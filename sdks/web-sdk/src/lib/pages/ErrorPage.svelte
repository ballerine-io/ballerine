<script lang="ts">
  import { T } from '../contexts/translation';
  import { onDestroy } from 'svelte';
  import { Image, Button, Title } from '../atoms';
  import { configuration, Steps } from '../contexts/configuration';
  import { currentParams } from '../contexts/app-state';
  import { Elements } from '../contexts/configuration/types';
  import { makeStylesFromConfiguration } from '../utils/css-utils';
  import ErrorText from '../atoms/ErrorText/ErrorText.svelte';
  import { sendFlowCompleteEvent } from '../utils/event-service';
  import { flowError } from '../services/analytics';
  import { addCloseToURLParams } from '../contexts/navigation/hooks';
  import merge from 'deepmerge';
  import { errorStep, layout } from '../default-configuration/theme';
  import { DecisionStatus } from '../contexts/app-state/types';
  import { mergeStepConfig } from '../services/merge-service';
  import { injectPrimaryIntoLayoutGradient } from '../services/theme-manager';

  export let stepId;

  const step = mergeStepConfig(errorStep, $configuration.steps[stepId]);
  const stepNamespace = step.namespace!;

  const style = makeStylesFromConfiguration(
    merge(
      injectPrimaryIntoLayoutGradient(layout, $configuration.general.colors.primary),
      $configuration.layout || {}
    ),
    step.style
  );

  const message = $currentParams ? $currentParams.message : '';

  const handleClose = () => {
    sendFlowCompleteEvent({ status: 'error', idvResult: DecisionStatus.DECLINED });
    addCloseToURLParams();
  };

  flowError();

  onDestroy(() => {
    $currentParams = null;
  });
</script>

<div class="container" {style}>
  {#each step.elements as element}
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
        {#if message}
          {message}
        {:else}
          <T key="description" namespace={stepNamespace} />
        {/if}
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
