<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Container } from '../../atoms';
  import Paragraph from '../../atoms/Paragraph/Paragraph.svelte';
  import { configuration as globalConfiguration, IAttributes } from '../../contexts/configuration';
  import { ICSSProperties } from '../../services/css-manager';
  import { IDocumentInfo } from '../../contexts/app-state';
  import { T } from '../../contexts/translation';
  import { IDocumentOptions } from '../../organisms/DocumentOptions';
  import { makesLocalStyles } from '../../services/css-manager';
  import Icon from '../../atoms/Icons/Icon.svelte';
  import { ICameraEvent, nativeCameraHandler } from '../../utils/photo-utils';
  import { isNativeCamera } from '../../contexts/flows/hooks';
  import { createToggle } from '../../hooks/createToggle/createToggle';

  export let configuration: IDocumentOptions;
  export let active: boolean;
  export let attributes: IAttributes;
  export let document: IDocumentInfo;

  const [isDisabled, , toggleOnIsDisabled] = createToggle();
  let hover = false;

  const setHover = (status: boolean) => (hover = status);

  const dispatch = createEventDispatcher();
  const handleSelect = () => {
    if ($isDisabled) return;

    dispatch('selectOption', document.kind);
    toggleOnIsDisabled();
  };

  const handler = async (e: ICameraEvent) => {
    if (!e.target) return;
    const image = await nativeCameraHandler(e);
    dispatch('photoTake', { image, type: document.type });
  };

  const style = makesLocalStyles(configuration.optionProps.style as ICSSProperties);
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
  {style}
  class="document-option"
  class:disabled={$isDisabled}
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
      <T key={`${document.kind}-title`} namespace="document-options" />
    </Paragraph>
    {#if configuration.descriptionProps}
      <Paragraph configuration={configuration.descriptionProps} active={hover || active}>
        <T key={`${document.kind}-description`} namespace="document-options" />
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
    align-items: var(--align-items);
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

  .disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
</style>
