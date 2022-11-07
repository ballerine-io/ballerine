<script lang="ts">
  import { T } from '../contexts/translation';
  import { Image, Title, Paragraph, IconButton } from '../atoms';
  import { configuration, Steps } from '../contexts/configuration';
  import { Elements } from '../contexts/configuration';
  import { makeStylesFromConfiguration } from '../utils/css-utils';
  import { DocumentOptions } from '../organisms';
  import { goToPrevStep } from '../contexts/navigation';
  import { currentStepId } from '../contexts/app-state';
  import merge from 'lodash.merge';
  import { documentSelectionStep, layout } from '../default-configuration/theme';

  export let stepId;

  const step = merge(documentSelectionStep, $configuration.steps[stepId]);
  const stepNamespace = step.namespace!;
  const style = makeStylesFromConfiguration(merge(layout, $configuration.layout), step.style);
</script>

<div class="container" {style}>
  {#each step.elements as element}
    {#if element.type === Elements.IconButton}
      <IconButton
        configuration={element.props}
        on:click={() => goToPrevStep(currentStepId, $configuration, $currentStepId)}
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
  {/each}
  <DocumentOptions {step} />
</div>

<style>
  .container {
    position: var(--position);
    padding: var(--padding);
    text-align: center;
    background: var(--background);
    height: 100%;
  }
</style>
