<script lang="ts">
  import { T } from '../contexts/translation';
  import { Image, Button, Title, Paragraph, IconButton } from '../atoms';
  import { configuration, Steps } from '../contexts/configuration';
  import { goToNextStep, goToPrevStep } from '../contexts/navigation';
  import { Elements } from '../contexts/configuration/types';
  import { makeStylesFromConfiguration } from '../utils/css-utils';
  import { ICameraEvent, nativeCameraHandler, updateDocument } from '../utils/photo-utils';
  import { IDocument, IDocumentInfo, currentStepId } from '../contexts/app-state';
  import { isNativeCamera } from '../contexts/flows';
  import { documents, selectedDocumentInfo } from '../contexts/app-state/stores';
  import merge from 'lodash.merge';
  import { documentPhotoBackStartStep, layout } from '../default-configuration/theme';

  export let stepId;

  const step = merge(documentPhotoBackStartStep, $configuration.steps[stepId]);
  const stepNamespace = step.namespace!;
  const style = makeStylesFromConfiguration(merge(layout, $configuration.layout), step.style);

  let documentInfo: IDocumentInfo | undefined = undefined;
  let document: IDocument | undefined;

  $: {
    documentInfo = step.documentInfo || $selectedDocumentInfo;
    if (!documentInfo) goToPrevStep(currentStepId, $configuration, $currentStepId);
    document = $documents.find(d => d.type === documentInfo?.type);
    if (!document) goToPrevStep(currentStepId, $configuration, $currentStepId);
  }

  const handler = async (e: ICameraEvent) => {
    const image = await nativeCameraHandler(e);
    if (!documentInfo) {
      throw Error("document context wasn't provided");
    }
    if (!document) return;
    const newDocumentsState = updateDocument(document.type, image, $documents);
    $documents = newDocumentsState;
    goToNextStep(currentStepId, $configuration, $currentStepId);
  };
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
        <T key="description" namespace={stepNamespace} />
      </Paragraph>
    {/if}
    {#if element.type === Elements.Button}
      <div class="button-container">
        {#if isNativeCamera($configuration)}
          <input
            class="camera-input"
            type="file"
            accept="image/*"
            capture="environment"
            on:change={handler}
          />
        {/if}
        <Button
          on:click={() => goToNextStep(currentStepId, $configuration, $currentStepId)}
          configuration={element.props}
        >
          <T key="button" namespace={stepNamespace} />
        </Button>
      </div>
    {/if}
  {/each}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: var(--padding);
    position: var(--position);
    background: var(--background);
    text-align: center;
  }

  .button-container {
    position: relative;
  }
  .camera-input {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    z-index: 3;
    opacity: 0;
  }
</style>
