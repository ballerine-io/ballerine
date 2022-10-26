<script lang="ts">
  import { T } from '../contexts/translation';
  import { Image, Button, Title, Paragraph, IconButton } from '../atoms';
  import { configuration, Steps } from '../contexts/configuration';
  import { goToNextStep, goToPrevStep } from '../contexts/navigation/hooks';
  import { Elements } from '../contexts/configuration/types';
  import { makeStylesFromConfiguration } from '../utils/cssUtils';
  import { ICameraEvent, nativeCameraHandler } from '../utils/photoUtils';
  import { isNativeCamera } from '../contexts/flows/hooks';
  import { selectedDocumentInfo, selfieUri, currentStepRoute } from '../contexts/appState/stores';
  import merge from 'lodash.merge';
  import { layout, selfieStartStep } from '../defaultConfiguration/theme';

  const step = merge(selfieStartStep, $configuration.steps[Steps.SelfieStart]);

  const style = makeStylesFromConfiguration(merge(layout, $configuration.layout), step.style);

  let skipBackSide = false;

  $: {
    if ($selectedDocumentInfo && !$selectedDocumentInfo.backSide) {
      skipBackSide = true;
    }
  }

  const handler = async (e: ICameraEvent) => {
    if (!e.target) return;
    $selfieUri = await nativeCameraHandler(e);
    goToNextStep(step, currentStepRoute, $configuration);
  };
</script>

<div class="container" {style}>
  {#each step.elements as element}
    {#if element.type === Elements.IconButton}
      <IconButton
        configuration={element.props}
        on:click={() =>
          goToPrevStep(
            step,
            currentStepRoute,
            $configuration,
            skipBackSide ? 'back-side' : undefined,
          )}
      />
    {/if}
    {#if element.type === Elements.Image}
      <Image configuration={element.props} />
    {/if}
    {#if element.type === Elements.Title}
      <Title configuration={element.props}>
        <T key="title" module="selfie-start" />
      </Title>
    {/if}
    {#if element.type === Elements.Paragraph}
      <Paragraph configuration={element.props}>
        <T key={element.props.context || 'description'} module="selfie-start" />
      </Paragraph>
    {/if}
    {#if element.type === Elements.Button}
      <div class="button-container">
        {#if isNativeCamera($configuration)}
          <input
            class="camera-input"
            type="file"
            accept="image/*"
            capture="user"
            on:change={handler}
          />
        {/if}
        <Button
          on:click={() => goToNextStep(step, currentStepRoute, $configuration)}
          configuration={element.props}
        >
          <T key="button" module="selfie-start" />
        </Button>
      </div>
    {/if}
  {/each}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    padding: var(--padding);
    position: var(--position);
    text-align: center;
    height: 100%;
    background: var(--background);
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
