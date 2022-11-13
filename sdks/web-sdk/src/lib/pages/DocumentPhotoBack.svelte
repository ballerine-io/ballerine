<script lang="ts">
  import CameraPhoto, { FACING_MODES } from 'jslib-html5-camera-photo';
  import { T } from '../contexts/translation';
  import { configuration } from '../contexts/configuration';
  import { makeStylesFromConfiguration } from '../utils/css-utils';
  import { onDestroy, onMount } from 'svelte';
  import { CameraButton, IconButton, IconCloseButton, Overlay, Paragraph, Title, VideoContainer } from '../atoms';
  import { Elements } from '../contexts/configuration/types';
  import { goToNextStep, goToPrevStep } from '../contexts/navigation';
  import { currentStepId, appState } from '../contexts/app-state';
  import { documents, selectedDocumentInfo } from '../contexts/app-state/stores';
  import { updateDocument } from '../utils/photo-utils';
  import { documentPhotoBackStep, settings } from '../default-configuration/theme';
  import merge from 'lodash.merge';
  import { layout } from '../default-configuration/theme';
  import { DocumentType } from '../contexts/app-state';
  import { EActionNames, sendButtonClickEvent, EVerificationStatuses } from '../utils/event-service';

  export let stepId;

  let video: HTMLVideoElement;
  let cameraPhoto: CameraPhoto | undefined = undefined;

  const step = merge(documentPhotoBackStep, $configuration.steps[stepId]);
  const style = makeStylesFromConfiguration(merge(layout, $configuration.layout), step.style);
  const documentType =
    ($configuration.steps[$currentStepId].type as DocumentType) || $selectedDocumentInfo.type;

  const stepNamespace = `${step.namespace}.${documentType}`;
  $: {
    if (!documentType) goToPrevStep(currentStepId, $configuration, $currentStepId);
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

  const handleTakePhoto = () => {
    const document = $documents.find(d => d.type === documentType);
    if (!cameraPhoto || !document) return;
    const base64 = cameraPhoto.getDataUri(
      $configuration.settings?.cameraSettings || settings.cameraSettings,
    );
    const newDocumentsState = updateDocument(document.type, base64, $documents);
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
    {#if element.type === Elements.IconCloseButton}
      <IconCloseButton
        configuration={element.props}
        on:click={() => {
          sendButtonClickEvent(EActionNames.CLOSE, { status: EVerificationStatuses.DATA_COLLECTION }, $appState, true);
        }}
      />
    {/if}
    {#if element.type === Elements.VideoContainer}
      <VideoContainer configuration={element.props}>
        <!-- svelte-ignore a11y-media-has-caption -->
        <video bind:this={video} autoplay playsinline />
      </VideoContainer>
    {/if}
  {/each}
  <div class="header">
    {#each step.elements as element}
      {#if element.type === Elements.Title}
        <Title configuration={element.props}>
          <T key={`title`} namespace={stepNamespace} />
        </Title>
      {/if}
      {#if element.type === Elements.Paragraph}
        <Paragraph configuration={element.props}>
          <T key={`description`} namespace={stepNamespace} />
        </Paragraph>
      {/if}
    {/each}
  </div>
  {#if documentType}
    <Overlay type={documentType} />
  {/if}
  {#each step.elements as element}
    {#if element.type === Elements.CameraButton}
      <CameraButton on:click={handleTakePhoto} configuration={element.props} />
    {/if}
  {/each}
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
    justify-content: space-between;
  }
  .header {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
