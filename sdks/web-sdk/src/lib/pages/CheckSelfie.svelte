<script lang="ts">
  import { T } from '../contexts/translation';
  import { Title, IconButton } from '../atoms';
  import { configuration, Steps } from '../contexts/configuration';
  import { Elements } from '../contexts/configuration/types';
  import { makeStylesFromConfiguration } from '../utils/css-utils';
  import { goToPrevStep } from '../contexts/navigation';
  import Paragraph from '../atoms/Paragraph/Paragraph.svelte';
  import NavigationButtons from '../molecules/NavigationButtons/NavigationButtons.svelte';
  import Photo from '../atoms/Photo/Photo.svelte';
  import { selfieUri, currentStepId } from '../contexts/app-state/stores';
  import merge from 'deepmerge';
  import { checkSelfieStep, layout } from '../default-configuration/theme';
  import { mergeStepConfig } from '../services/merge-service';
  import { injectPrimaryIntoLayoutGradient } from '../services/theme-manager';

  export let stepId;

  const step = mergeStepConfig(checkSelfieStep, $configuration.steps[stepId]);
  const stepNamespace = step.namespace!;

  const style = makeStylesFromConfiguration(
    merge(
      injectPrimaryIntoLayoutGradient(layout, $configuration.general.colors.primary),
      $configuration.layout || {}
    ),
    step.style
  );
</script>

<div class="container" {style}>
  {#each step.elements as element}
    {#if element.type === Elements.Photo}
      <Photo src={$selfieUri} configuration={element.props} />
    {/if}
    {#if element.type === Elements.IconButton}
      <IconButton
        configuration={element.props}
        on:click={() => goToPrevStep(currentStepId, $configuration, $currentStepId)}
      />
    {/if}
    {#if element.type === Elements.Title}
      <Title configuration={element.props}>
        <T key="title" namespace={stepNamespace} />
      </Title>
    {/if}
    {#if element.type === Elements.Paragraph}
      <Paragraph configuration={element.props}>
        <T key="description" namespace={stepNamespace} />
      </Paragraph>
    {/if}
  {/each}
  <NavigationButtons {step} />
</div>

<style>
  .container {
    padding: var(--padding);
    position: var(--position);
    background: var(--background);
    text-align: center;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
