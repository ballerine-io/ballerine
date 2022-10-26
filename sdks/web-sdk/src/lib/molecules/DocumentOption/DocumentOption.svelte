<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Container } from '../../atoms';
  import Paragraph from '../../atoms/Paragraph/Paragraph.svelte';
  import {
    ICSSProperties,
    IAttributes,
    configuration as globalConfiguration,
  } from '../../contexts/configuration';
  import { IDocumentInfo } from '../../contexts/appState';
  import { T } from '../../contexts/translation';
  import { IDocumentOptions } from '../../organisms/DocumentOptions';
  import { makesLocalStyles } from '../../utils/cssUtils';
  import Icon from '../../atoms/Icons/Icon.svelte';
  import { ICameraEvent, nativeCameraHandler } from '../../utils/photoUtils';
  import { isNativeCamera } from '../../contexts/flows/hooks';

  export let configuration: IDocumentOptions;
  export let active: boolean;
  export let attributes: IAttributes;
  export let document: IDocumentInfo;

  let hover = false;

  const setHover = (status: boolean) => (hover = status);

  const dispatch = createEventDispatcher();

  const handleSelect = () => {
    dispatch('selectOption', document.type);
  };

  const handler = async (e: ICameraEvent) => {
    if (!e.target) return;
    const image = await nativeCameraHandler(e);
    dispatch('photoTake', { image, type: document.type });
  };

  const style = makesLocalStyles(configuration.optionProps.style as ICSSProperties);
</script>

<div
  {style}
  class="document-option"
  class:active
  on:click={handleSelect}
  on:mouseover={() => setHover(true)}
  on:focus={() => setHover(true)}
  on:mouseleave={() => setHover(false)}
>
  {#if isNativeCamera($globalConfiguration)}
    <input
      class="camera-input"
      type="file"
      accept="image/*"
      capture="environment"
      on:change={handler}
    />
  {/if}
  <Container configuration={configuration.iconContainerProps} active={hover || active}>
    <Icon
      name={attributes.icon}
      width={attributes.width}
      height={attributes.height}
      configuration={configuration.iconProps}
      active={hover || active}
    />
  </Container>
  <div class="text-container">
    <Paragraph configuration={configuration.titleProps} active={hover || active}>
      <T key={`${document.type}-title`} module="document-options" />
    </Paragraph>
    {#if configuration.descriptionProps}
      <Paragraph configuration={configuration.descriptionProps} active={hover || active}>
        <T key={`${document.type}-description`} module="document-options" />
      </Paragraph>
    {/if}
  </div>
</div>

<style>
  .document-option {
    cursor: pointer;
    border-radius: var(--border-radius);
    padding: var(--padding);
    margin: var(--margin);
    width: var(--width);
    border: var(--border);
    display: var(--display);
    text-align: var(--text-align);
    background: var(--background);
    transition: all 0.1s ease-in;
    user-select: none;
    position: relative;
  }
  .document-option:hover {
    background: var(--hover-background);
    border: var(--hover-border);
  }
  .document-option:active {
    background: var(--hover-background);
    border: var(--hover-border);
  }
  .document-option.active {
    background: var(--hover-background);
    border: var(--hover-border);
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
