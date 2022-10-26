<script lang="ts">
  import CameraPhoto, { FACING_MODES } from 'jslib-html5-camera-photo';
  import { T } from '../contexts/translation';
  import { configuration, Steps } from '../contexts/configuration';
  import { makeStylesFromConfiguration } from '../utils/cssUtils';
  import { onDestroy, onMount } from 'svelte';
  import { CameraButton, IconButton, Overlay, Paragraph, VideoContainer } from '../atoms';
  import { Elements } from '../contexts/configuration/types';
  import { DocumentType, IDocument } from '../contexts/appState';
  import { goToNextStep, goToPrevStep } from '../contexts/navigation';
  import Title from '../atoms/Title/Title.svelte';
  import { IDocumentInfo } from '../contexts/appState/types';
  import { documents, selectedDocumentInfo, currentStepRoute } from '../contexts/appState/stores';
  import {
    documentOptions,
    documentPhotoStep,
    documentSelectionStep,
    settings,
  } from '../defaultConfiguration/theme';
  import merge from 'lodash.merge';
  import { layout } from '../defaultConfiguration/theme';

  let video: HTMLVideoElement;
  let container: HTMLDivElement;
  let cameraPhoto: CameraPhoto | undefined = undefined;

  const step = merge(documentPhotoStep, $configuration.steps[Steps.DocumentPhoto]);

  const style = makeStylesFromConfiguration(merge(layout, $configuration.layout), step.style);
  const documentOptionsConfiguration = merge(documentOptions, $configuration.documentOptions);

  let documentInfo: IDocumentInfo | undefined = undefined;

  $: {
    documentInfo = step.documentInfo || $selectedDocumentInfo;
    if (!documentInfo) {
      goToPrevStep(step, currentStepRoute, $configuration);
    }
  }

  onMount(() => {
    if (!video) return;
    cameraPhoto = new CameraPhoto(video);
    cameraPhoto
      .startCamera(FACING_MODES.ENVIRONMENT, {
        width: 1920,
        height: 1080,
      })
      .then(stream => {
        console.log('stream', stream);
      })
      .catch(error => {
        console.log('error', error);
      });
  });

  onDestroy(() => {
    cameraPhoto?.stopCamera();
  });

  const clearDocs = (type: DocumentType): IDocument[] => {
    const { options } = documentOptionsConfiguration;
    const isFromOptions = Object.keys(options).find(key => key === type);
    if (isFromOptions) {
      return $documents.filter(d => !Object.keys(options).find(key => key === d.type));
    }
    return $documents.filter(d => type !== d.type);
  };

  const addDocument = (type: DocumentType, base64: string, document: IDocument): IDocument[] => {
    const clearedDocuments = clearDocs(type);
    return [
      ...clearedDocuments,
      {
        ...document,
        pages: [{ side: 'front', base64 }],
      },
    ];
  };

  const handleTakePhoto = () => {
    if (!cameraPhoto) return;
    const base64 = cameraPhoto.getDataUri(
      $configuration.settings?.cameraSettings || settings.cameraSettings,
    );
    if (documentInfo) {
      const document = { type: documentInfo?.type, pages: [], metadata: {} };
      $documents = addDocument(document.type, base64, document);
      return goToNextStep(step, currentStepRoute, $configuration);
    }
    return goToPrevStep(step, currentStepRoute, $configuration);
  };
</script>

<div class="container" {style} bind:this={container}>
  {#each step.elements as element}
    {#if element.type === Elements.IconButton}
      <IconButton
        configuration={element.props}
        on:click={() => goToPrevStep(step, currentStepRoute, $configuration)}
      />
    {/if}
    {#if element.type === Elements.VideoContainer}
      <VideoContainer configuration={element.props}>
        <!-- svelte-ignore a11y-media-has-caption -->
        <video bind:this={video} autoplay playsinline />
      </VideoContainer>
    {/if}
    {#if element.type === Elements.Title}
      <Title configuration={element.props}>
        <T key={`${documentInfo?.type}-title`} module="document-photo" />
      </Title>
    {/if}
    {#if element.type === Elements.Paragraph}
      <Paragraph configuration={element.props}>
        <T key={`${documentInfo?.type}-description`} module="document-photo" />
      </Paragraph>
    {/if}
    {#if element.type === Elements.CameraButton}
      <CameraButton on:click={handleTakePhoto} configuration={element.props} />
    {/if}
  {/each}
  {#if documentInfo}
    <Overlay type={documentInfo.type} />
  {/if}
</div>

<style>
  .container {
    height: 100%;
    position: var(--position);
    background: var(--background);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
