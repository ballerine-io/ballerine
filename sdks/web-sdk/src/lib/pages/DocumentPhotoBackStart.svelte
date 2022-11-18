<script lang="ts">
  import { T } from '../contexts/translation';
  import { Image, Button, Title, Paragraph, IconButton, IconCloseButton } from '../atoms';
  import { configuration } from '../contexts/configuration';
  import { goToNextStep, goToPrevStep } from '../contexts/navigation';
  import { Elements } from '../contexts/configuration/types';
  import { makeStylesFromConfiguration } from '../utils/css-utils';
  import { ICameraEvent, nativeCameraHandler, updateDocument } from '../utils/photo-utils';
  import { IDocument, IDocumentInfo, currentStepId, appState } from '../contexts/app-state';
  import { isNativeCamera } from '../contexts/flows';
  import { documents, selectedDocumentInfo } from '../contexts/app-state/stores';
  import merge from 'deepmerge';
  import { documentPhotoBackStartStep, layout } from '../default-configuration/theme';
  import { mergeStepConfig } from '../services/merge-service';
  import { preloadNextStepByCurrent } from '../services/preload-service';
  import { injectPrimaryIntoLayoutGradient } from '../services/theme-manager';
  import {
    EActionNames,
    sendButtonClickEvent,
    EVerificationStatuses,
  } from '../utils/event-service';
  import { getFlowConfig } from '../contexts/flows/hooks';

  export let stepId;

  const step = mergeStepConfig(documentPhotoBackStartStep, $configuration.steps[stepId]);

  const flow = getFlowConfig($configuration);

  const stepNamespace = step.namespace!;

  const style = makeStylesFromConfiguration(
    merge(
      injectPrimaryIntoLayoutGradient(layout, $configuration.general.colors.primary),
      $configuration.layout || {},
    ),
    step.style,
  );

  let documentInfo: IDocumentInfo | undefined = undefined;
  let document: IDocument | undefined;

  $: {
    documentInfo = step.documentInfo || $selectedDocumentInfo;
    if (!documentInfo) goToPrevStep(currentStepId, $configuration, $currentStepId);
    document = $documents.find(d => d.type === documentInfo?.type);
    if (!document) goToPrevStep(currentStepId, $configuration, $currentStepId);
  }

  const handler = async (e: ICameraEvent) => {
    const image = await nativeCameraHandler(e);
    if (!documentInfo) {
      throw Error("document context wasn't provided");
    }
    if (!document) return;
    const newDocumentsState = updateDocument(document.type, image, $documents);
    $documents = newDocumentsState;
    goToNextStep(currentStepId, $configuration, $currentStepId);
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
    {#if element.type === Elements.IconCloseButton && flow.showCloseButton}
      <IconCloseButton
        configuration={element.props}
        on:click={() => {
          sendButtonClickEvent(
            EActionNames.CLOSE,
            { status: EVerificationStatuses.DATA_COLLECTION },
            $appState,
            true,
          );
        }}
      />
    {/if}
    {#if element.type === Elements.Image}
      <Image configuration={element.props} />
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
        <Button
          on:click={() => goToNextStep(currentStepId, $configuration, $currentStepId)}
          configuration={element.props}
        >
          <T key="button" namespace={stepNamespace} />
        </Button>
      </div>
    {/if}
  {/each}
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
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
  }
</style>
