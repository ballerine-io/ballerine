<script lang="ts">
  import CameraPhoto, { FACING_MODES } from 'jslib-html5-camera-photo';
  import { T } from '../contexts/translation';
  import { configuration, Steps } from '../contexts/configuration';
  import { makeStylesFromConfiguration } from '../utils/css-utils';
  import { onDestroy, onMount } from 'svelte';
  import { CameraButton, IconButton, Overlay, Paragraph, VideoContainer } from '../atoms';
  import { Elements } from '../contexts/configuration/types';
  import { goToNextStep, goToPrevStep } from '../contexts/navigation';
  import { currentStepRoute, DocumentType } from '../contexts/app-state';
  import Title from '../atoms/Title/Title.svelte';
  import { selfieUri } from '../contexts/app-state/stores';
  import { isMobile } from '../utils/is-mobile';
  import { selfieStep, settings } from '../default-configuration/theme';
  import merge from 'lodash.merge';
  import { layout } from '../default-configuration/theme';

  let video: HTMLVideoElement;
  let cameraPhoto: CameraPhoto | undefined = undefined;

  const step = merge(selfieStep, $configuration.steps[Steps.Selfie]);
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
    goToNextStep(step, currentStepRoute, $configuration);
  };
</script>

<div class="container" {style}>
  {#each step.elements as element}
    {#if element.type === Elements.IconButton}
      <IconButton
        configuration={element.props}
        on:click={() => goToPrevStep(step, currentStepRoute, $configuration)}
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
        <T key="title" module="selfie" />
      </Title>
    {/if}
    {#if element.type === Elements.Paragraph}
      <Paragraph configuration={element.props}>
        <T key="description" module="selfie" />
      </Paragraph>
    {/if}
    {#if element.type === Elements.CameraButton}
      <CameraButton on:click={handleTakePhoto} configuration={element.props} />
    {/if}
  {/each}
  <Overlay type={DocumentType.SELFIE} />
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
