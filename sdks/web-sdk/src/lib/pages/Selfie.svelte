<script lang="ts">
  import CameraPhoto, { FACING_MODES } from 'jslib-html5-camera-photo';
  import { T } from '../contexts/translation';
  import { configuration } from '../contexts/configuration';
  import { makeStylesFromConfiguration } from '../utils/css-utils';
  import { onDestroy, onMount } from 'svelte';
  import { CameraButton, IconButton, IconCloseButton, Overlay, Paragraph, VideoContainer } from '../atoms';
  import { Elements } from '../contexts/configuration/types';
  import { goToNextStep, goToPrevStep } from '../contexts/navigation';
  import { currentStepId, DocumentType } from '../contexts/app-state';
  import Title from '../atoms/Title/Title.svelte';
  import { appState, selfieUri } from '../contexts/app-state/stores';
  import { isMobile } from '../utils/is-mobile';
  import { selfieStep, settings } from '../default-configuration/theme';
  import merge from 'lodash.merge';
  import { layout } from '../default-configuration/theme';
  import { EActionNames, sendButtonClickEvent, EVerificationStatuses } from '../utils/event-service';

  let video: HTMLVideoElement;
  let cameraPhoto: CameraPhoto | undefined = undefined;

  export let stepId;

  const step = merge(selfieStep, $configuration.steps[stepId]);
  const stepNamespace = step.namespace!;
  const style = makeStylesFromConfiguration(merge(layout, $configuration.layout), step.style);

  const facingMode = isMobile() ? FACING_MODES.USER : FACING_MODES.ENVIRONMENT;

  onMount(() => {
    if (!video) return;
    cameraPhoto = new CameraPhoto(video);
    cameraPhoto
      .startCamera(facingMode, {
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
    if (!cameraPhoto) return;
    const dataUri = cameraPhoto.getDataUri(
      $configuration.settings?.selfieCameraSettings || settings.cameraSettings,
    );
    $selfieUri = dataUri;
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
      <VideoContainer configuration={element.props} isSelfie>
        <!-- svelte-ignore a11y-media-has-caption -->
        <video bind:this={video} autoplay playsinline />
      </VideoContainer>
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
  {/each}
  <Overlay type={DocumentType.SELFIE} />
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
    justify-content: center;
  }
</style>
