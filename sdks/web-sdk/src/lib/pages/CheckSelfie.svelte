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
  import { selfieUri, currentStepRoute } from '../contexts/app-state/stores';
  import merge from 'lodash.merge';
  import { checkSelfieStep, layout } from '../default-configuration/theme';

  const step = merge(checkSelfieStep, $configuration.steps[Steps.CheckSelfie]);
  const style = makeStylesFromConfiguration(merge(layout, $configuration.layout), step.style);
</script>

<div class="container" {style}>
  {#each step.elements as element}
    {#if element.type === Elements.Photo}
      <Photo src={$selfieUri} configuration={element.props} />
    {/if}
    {#if element.type === Elements.IconButton}
      <IconButton
        configuration={element.props}
        on:click={() => goToPrevStep(step, currentStepRoute, $configuration)}
      />
    {/if}
    {#if element.type === Elements.Title}
      <Title configuration={element.props}>
        <T key="title" module="check-selfie" />
      </Title>
    {/if}
    {#if element.type === Elements.Paragraph}
      <Paragraph configuration={element.props}>
        <T key="description" module="check-selfie" />
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
