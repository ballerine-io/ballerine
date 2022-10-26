<script lang="ts">
  import { T } from '../contexts/translation';
  import { Image, Title, Paragraph, IconButton } from '../atoms';
  import { configuration, Steps } from '../contexts/configuration';
  import { Elements } from '../contexts/configuration';
  import { makeStylesFromConfiguration } from '../utils/cssUtils';
  import { DocumentOptions } from '../organisms';
  import { goToPrevStep } from '../contexts/navigation';
  import { currentStepRoute } from '../contexts/appState';
  import merge from 'lodash.merge';
  import { documentSelectionStep, layout } from '../defaultConfiguration/theme';

  const step = merge(documentSelectionStep, $configuration.steps[Steps.DocumentSelection]);
  const style = makeStylesFromConfiguration(merge(layout, $configuration.layout), step.style);
</script>

<div class="container" {style}>
  {#each step.elements as element}
    {#if element.type === Elements.IconButton}
      <IconButton
        configuration={element.props}
        on:click={() => goToPrevStep(step, currentStepRoute, $configuration)}
      />
    {/if}
    {#if element.type === Elements.Image}
      <Image configuration={element.props} />
    {/if}
    {#if element.type === Elements.Title}
      <Title configuration={element.props}>
        <T key="title" module="document-selection" />
      </Title>
    {/if}
    {#if element.type === Elements.Paragraph}
      <Paragraph configuration={element.props}>
        <T key={element.props.context || 'description'} module="document-selection" />
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
