<script lang="ts">
  import { T } from '../contexts/translation';
  import { IconButton, IconCloseButton, Image, Paragraph, Photo, Title } from '../atoms';
  import { configuration } from '../contexts/configuration';
  import { Elements } from '../contexts/configuration/types';
  import { goToPrevStep } from '../contexts/navigation';
  import { appState, getDocImage } from '../contexts/app-state';
  import { NavigationButtons } from '../molecules';
  import { currentStepId, documents, selectedDocumentInfo } from '../contexts/app-state/stores';
  import { preloadNextStepByCurrent } from '../services/preload-service';
  import { ActionNames, sendButtonClickEvent, VerificationStatuses } from '../utils/event-service';
  import { getLayoutStyles, getStepConfiguration } from '../ui-packs';
  import { getFlowConfig } from '../contexts/flows/hooks';
  import { getDocumentType } from '../utils/documents-utils';
  import { getOverlayDocumentType } from '../atoms/Overlay/utils';

  export let stepId;

  const step = getStepConfiguration($configuration, stepId);
  const flow = getFlowConfig($configuration);
  const style = getLayoutStyles($configuration, step);

  const stepNamespace = step.namespace!;
  const documentType = getDocumentType(step, $selectedDocumentInfo);
  const overlayType = documentType ? getOverlayDocumentType(documentType) : '';

  let image = '';
  let skipBackSide = false;

  // Resolve documentInfo from step config (pre-selected) or store (user-selected).
  // When document-selection step is skipped, the store is never populated — so we
  // must also check step.documentInfo (set by the host page for pre-selected types).
  const resolvedDocumentInfo = step.documentInfo || $selectedDocumentInfo;

  $: {
    if (!documentType) {
      goToPrevStep(currentStepId, $configuration, $currentStepId);
    }
    if (documentType) {
      image = getDocImage(documentType, $documents);
    }
    if (resolvedDocumentInfo && !resolvedDocumentInfo.backSide) {
      skipBackSide = true;
    }
    preloadNextStepByCurrent(
      $configuration,
      configuration,
      $currentStepId,
      skipBackSide ? 'back-side' : undefined,
    );
  }
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
            ActionNames.CLOSE,
            { status: VerificationStatuses.DATA_COLLECTION },
            $appState,
            true,
          );
        }}
      />
    {/if}
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
    {#if element.type === Elements.Photo}
      <Photo configuration={element.props} src={image} {overlayType} />
    {/if}
    {#if element.type === Elements.Image}
      <Image configuration={element.props} />
    {/if}
  {/each}
  <NavigationButtons {skipBackSide} />
</div>

<style>
  .container {
    padding: var(--padding);
    position: var(--position);
    background: var(--background);
    text-align: center;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
</style>
