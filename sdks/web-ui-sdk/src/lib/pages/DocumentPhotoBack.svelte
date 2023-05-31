<script lang="ts">
  import CameraPhoto, { CaptureConfigOption, FACING_MODES } from 'jslib-html5-camera-photo';
  import { T } from '../contexts/translation';
  import { configuration } from '../contexts/configuration';
  import { onDestroy, onMount } from 'svelte';
  import {
    CameraButton,
    IconButton,
    Loader,
    Overlay,
    Paragraph,
    Title,
    VideoContainer,
  } from '../atoms';
  import { Elements } from '../contexts/configuration/types';
  import { goToNextStep, goToPrevStep } from '../contexts/navigation';
  import { currentStepId } from '../contexts/app-state';
  import { documents, selectedDocumentInfo } from '../contexts/app-state/stores';
  import { updateDocument } from '../utils/photo-utils';
  import { createToggle } from '../hooks/createToggle/createToggle';
  import { preloadNextStepByCurrent } from '../services/preload-service';
  import { getLayoutStyles, getStepConfiguration } from '../ui-packs';
  import { getDocumentType } from '../utils/documents-utils';

  export let stepId;

  let video: HTMLVideoElement;
  let cameraPhoto: CameraPhoto | undefined = undefined;

  const step = getStepConfiguration($configuration, stepId);
  const style = getLayoutStyles($configuration, step);

  const [isDisabled, , toggleOnIsDisabled, toggleOffIsDisabled] = createToggle(true);

  const documentType = getDocumentType(step, $selectedDocumentInfo);

  const documentKind = $selectedDocumentInfo ? $selectedDocumentInfo.kind : undefined;

  let stream: MediaStream;
  const stepNamespace = `${step.namespace}.${documentKind || documentType}`;
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
      .then(cameraStream => {
        console.log('stream', cameraStream);
        stream = cameraStream;
        toggleOffIsDisabled();
      })
      .catch(error => {
        console.log('error', error);
      });
  });

  onDestroy(() => {
    cameraPhoto?.stopCamera();
  });

  const handleTakePhoto = () => {
    const document = $documents.find(
      d => (d.kind && d.kind === documentKind) || d.type === documentType,
    );
    if (!cameraPhoto || !document || $isDisabled) return;
    const base64 = cameraPhoto.getDataUri(
      $configuration.settings?.cameraSettings as CaptureConfigOption,
    );
    const newDocumentsState = updateDocument(document, base64, $documents);
    $documents = newDocumentsState;
    goToNextStep(currentStepId, $configuration, $currentStepId);
    toggleOnIsDisabled();
  };

  preloadNextStepByCurrent($configuration, configuration, $currentStepId);
</script>

<div class="container" {style}>
  {#each step.elements as element}
    {#if element.type === Elements.IconButton}
      <IconButton
        configuration={element.props}
        on:click={() => goToPrevStep(currentStepId, $configuration, $currentStepId)}
      />
    {/if}
    {#if element.type === Elements.VideoContainer}
      <VideoContainer configuration={element.props}>
        <!-- svelte-ignore a11y-media-has-caption -->
        <video bind:this={video} autoplay playsinline />
      </VideoContainer>
    {/if}
    {#if element.type === Elements.Loader && stream === undefined}
      <Loader />
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
      <CameraButton
        on:click={handleTakePhoto}
        configuration={element.props}
        isDisabled={$isDisabled}
      />
    {/if}
  {/each}
</div>

<style>
  .container {
    height: 100%;
    position: var(--position);
    background: var(--background);
    padding: var(--padding);
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
