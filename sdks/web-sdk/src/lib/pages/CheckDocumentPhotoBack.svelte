<script lang="ts">
  import { T } from '../contexts/translation';
  import { Title, IconButton, Photo, Paragraph } from '../atoms';
  import { configuration, Steps } from '../contexts/configuration';
  import { Elements } from '../contexts/configuration/types';
  import { makeStylesFromConfiguration } from '../utils/css-utils';
  import { goToPrevStep } from '../contexts/navigation';
  import { getDocImage, IDocumentInfo } from '../contexts/app-state';
  import { NavigationButtons } from '../molecules';
  import { documents, selectedDocumentInfo, currentStepId } from '../contexts/app-state/stores';
  import merge from 'lodash.merge';
  import { checkDocumentPhotoBackStep, layout } from '../default-configuration/theme';

  const step = merge(
    checkDocumentPhotoBackStep,
    $configuration.steps[Steps.CheckDocumentPhotoBack],
  );
  const style = makeStylesFromConfiguration(merge(layout, $configuration.layout), step.style);

  let image: string;
  let documentInfo: IDocumentInfo | undefined = undefined;

  $: {
    documentInfo = step.documentInfo || $selectedDocumentInfo;
    if ($documents.length === 0 || !documentInfo) {
      goToPrevStep(currentStepId, $configuration, $currentStepId);
    }
    if (documentInfo) {
      image = getDocImage(documentInfo.type, $documents, 'back');
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
        <T key="title" module="check-document-photo-back" />
      </Title>
    {/if}
    {#if element.type === Elements.Paragraph}
      <Paragraph configuration={element.props}>
        <T key="description" module="check-document-photo-back" />
      </Paragraph>
    {/if}
    {#if element.type === Elements.Photo}
      <Photo configuration={element.props} src={image} />
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
