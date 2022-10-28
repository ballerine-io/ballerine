<script lang="ts">
  import { T } from '../contexts/translation';
  import { Image, Button, Title, Paragraph, IconButton } from '../atoms';
  import { configuration, Steps } from '../contexts/configuration';
  import { goToNextStep, goToPrevStep } from '../contexts/navigation/hooks';
  import { Elements, IStepConfiguration } from '../contexts/configuration/types';
  import { makeStylesFromConfiguration } from '../utils/css-utils';
  import { IDocument, currentStepId, DocumentType } from '../contexts/app-state';
  import { isNativeCamera } from '../contexts/flows/hooks';
  import { addDocument, ICameraEvent, nativeCameraHandler } from '../utils/photo-utils';
  import { documents, selectedDocumentInfo } from '../contexts/app-state/stores';
  import { documentStartStep, layout } from '../default-configuration/theme';
  import merge from 'lodash.merge';

  const step = merge(documentStartStep, $configuration.steps[Steps.DocumentStart]) as IStepConfiguration;

  const style = makeStylesFromConfiguration(merge(layout, $configuration.layout), step.style);

  const documentType = $configuration.steps[$currentStepId].type as DocumentType || $selectedDocumentInfo.type;

  $: {
    if (!documentType) goToPrevStep(currentStepId, $configuration, $currentStepId);
  }

  const handleGoToNextStep = async () => {
    await navigator.mediaDevices.getUserMedia({ video: true }); // TODO: add catch for missing premessions, and handle appropetly
    goToNextStep(currentStepId, $configuration, $currentStepId);
  };

  const handler = async (e: ICameraEvent) => {
    if (!e.target) return;
    const image = await nativeCameraHandler(e);
    if (!documentType) {
      throw Error("document context wasn't provided");
    }
    const document: IDocument = { type: documentType, metadata: {}, pages: [] };
    const newDocumentsState: IDocument[] = addDocument(
      document.type,
      image,
      $configuration,
      $documents,
      document,
    );
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
        <T key={`${documentType}-title`} module="document-start" />
      </Title>
    {/if}
    {#if element.type === Elements.Paragraph}
      <Paragraph configuration={element.props}>
        <T key={`${documentType}-description`} module="document-start" />
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
        <Button on:click={handleGoToNextStep} configuration={element.props}>
          <T key={`${documentType}-button`} module="document-start" />
        </Button>
      </div>
    {/if}
  {/each}
</div>

<style>
  .container {
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
    cursor: pointer;
  }
</style>
