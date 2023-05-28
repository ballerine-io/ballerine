<script lang="ts">
  import CameraPhoto, { CaptureConfigOption, FACING_MODES } from 'jslib-html5-camera-photo';
  import { T } from '../contexts/translation';
  import { configuration } from '../contexts/configuration';
  import { onDestroy, onMount } from 'svelte';
  import {
    CameraButton,
    IconButton,
    IconCloseButton,
    Loader,
    Overlay,
    Paragraph,
    VideoContainer,
  } from '../atoms';
  import { Elements } from '../contexts/configuration/types';
  import { appState, IDocument } from '../contexts/app-state';
  import { goToNextStep, goToPrevStep } from '../contexts/navigation';
  import Title from '../atoms/Title/Title.svelte';
  import { currentStepId, documents, selectedDocumentInfo } from '../contexts/app-state/stores';
  import { preloadNextStepByCurrent } from '../services/preload-service';
  import { ActionNames, sendButtonClickEvent, VerificationStatuses } from '../utils/event-service';
  import { getLayoutStyles, getStepConfiguration } from '../ui-packs';
  import { createToggle } from '../hooks/createToggle/createToggle';
  import { getDocumentType } from '../utils/documents-utils';
  import { IDocumentOptions } from '../organisms/DocumentOptions';
  import { TDocumentType } from '../contexts/app-state/types';

  export let stepId;

  let video: HTMLVideoElement;
  let container: HTMLDivElement;
  let cameraPhoto: CameraPhoto | undefined = undefined;

  const step = getStepConfiguration($configuration, stepId);
  const style = getLayoutStyles($configuration, step);

  const [isDisabled, , toggleOnIsDisabled, toggleOffIsDisabled] = createToggle(true);

  const documentOptionsConfiguration = $configuration.components
    ?.documentOptions as IDocumentOptions;

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

  const clearDocs = (type: TDocumentType): IDocument[] => {
    const { options } = documentOptionsConfiguration;
    const isFromOptions = Object.keys(options).find(key => key === type);
    if (isFromOptions) {
      return $documents.filter(d => !Object.keys(options).find(key => key === d.type));
    }
    return $documents.filter(d => type !== d.type);
  };

  const addDocument = (type: TDocumentType, base64: string, document: IDocument): IDocument[] => {
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
    if (!cameraPhoto || $isDisabled) return;

    toggleOnIsDisabled();
    const base64 = cameraPhoto.getDataUri(
      $configuration.settings?.cameraSettings as CaptureConfigOption,
    );
    if (documentType) {
      const document = {
        type: documentType,
        pages: [],
        metadata: {},
        kind: $selectedDocumentInfo?.kind,
      };
      $documents = addDocument(document.type, base64, document);
      return goToNextStep(currentStepId, $configuration, $currentStepId);
    }
    return goToPrevStep(currentStepId, $configuration, $currentStepId);
  };

  preloadNextStepByCurrent($configuration, configuration, $currentStepId);
</script>

<div class="container" {style} bind:this={container}>
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
          sendButtonClickEvent(
            ActionNames.CLOSE,
            { status: VerificationStatuses.DATA_COLLECTION },
            $appState,
            true,
          );
        }}
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
          <T key={'title'} namespace={stepNamespace} />
        </Title>
      {/if}
      {#if element.type === Elements.Paragraph}
        <Paragraph configuration={element.props}>
          <T key={'description'} namespace={stepNamespace} />
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
  }

  .header {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
</style>
