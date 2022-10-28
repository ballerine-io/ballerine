<script lang="ts">
  import { T } from '../contexts/translation';
  import { Image, Button, Title } from '../atoms';
  import { configuration, Steps } from '../contexts/configuration';
  import { currentStepId, currentParams } from '../contexts/app-state';
  import { Elements } from '../contexts/configuration/types';
  import { makeStylesFromConfiguration } from '../utils/css-utils';
  import ErrorText from '../atoms/ErrorText/ErrorText.svelte';
  import { flowResubmission } from '../services/analytics';
  import { onDestroy } from 'svelte';
  import merge from 'lodash.merge';
  import { layout, resubmissionStep } from '../default-configuration/theme';

  const step = merge(resubmissionStep, $configuration.steps[Steps.Resubmission]);

  const hasDocumentSelection = !!$configuration.steps[Steps.DocumentSelection];
  const style = makeStylesFromConfiguration(merge(layout, $configuration.layout), step.style);

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
    {#if element.type === Elements.Title}
      <Title configuration={element.props}>
        <T key={`${reasonCode}-title`} module="resubmission" />
      </Title>
    {/if}
    {#if element.type === Elements.ErrorText}
      <ErrorText configuration={element.props}>
        <T key={`${reasonCode}-description`} module="resubmission" />
      </ErrorText>
    {/if}
    {#if element.type === Elements.Button}
      <Button configuration={element.props} on:click={handleNavigate}>
        <T key={`${reasonCode}-button`} module="resubmission" />
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
