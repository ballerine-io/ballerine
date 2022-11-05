<script lang="ts">
  import { T } from '../contexts/translation';
  import { Title, IconButton, Photo, Paragraph } from '../atoms';
  import { configuration, Steps } from '../contexts/configuration';
  import { Elements } from '../contexts/configuration/types';
  import { makeStylesFromConfiguration } from '../utils/css-utils';
  import { goToPrevStep } from '../contexts/navigation';
  import { DocumentType, getDocImage } from '../contexts/app-state';
  import { NavigationButtons } from '../molecules';
  import { documents, currentStepId, selectedDocumentInfo } from '../contexts/app-state/stores';
  import merge from 'lodash.merge';
  import { checkDocumentStep, layout } from '../default-configuration/theme';

  const step = merge(checkDocumentStep, $configuration.steps[Steps.CheckDocument]);

  const style = makeStylesFromConfiguration(merge(layout, $configuration.layout), step.style);

  const documentType =
    ($configuration.steps[$currentStepId].type as DocumentType) || $selectedDocumentInfo.type;

  let image = '';
  let skipBackSide = false;

  $: {
    if (!documentType) {
      goToPrevStep(currentStepId, $configuration, $currentStepId);
    }
    if (documentType) {
      image = getDocImage(documentType, $documents);
    }
    if ($selectedDocumentInfo && !$selectedDocumentInfo.backSide) {
      skipBackSide = true;
    }
  }
</script>

<div class="container" {style}>
  {#each step.elements as element}
    {#if element.type === Elements.IconButton}
      <IconButton
        configuration={element.props}
        on:click={() => goToPrevStep(currentStepId, $configuration, $currentStepId)}
      />
    {/if}
    {#if element.type === Elements.Title}
      <Title configuration={element.props}>
        <T key={`${documentType}-title`} module="check-document" />
      </Title>
    {/if}
    {#if element.type === Elements.Paragraph}
      <Paragraph configuration={element.props}>
        <T key={`${documentType}-description`} module="check-document" />
      </Paragraph>
    {/if}
    {#if element.type === Elements.Photo}
      <Photo configuration={element.props} src={image} />
    {/if}
  {/each}
  <NavigationButtons {step} {skipBackSide} />
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
