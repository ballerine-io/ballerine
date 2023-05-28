<script lang="ts">
  import { T } from '../contexts/translation';
  import { IconButton, IconCloseButton, Image, Paragraph, Photo, Title } from '../atoms';
  import { configuration } from '../contexts/configuration';
  import { Elements } from '../contexts/configuration/types';
  import { goToPrevStep } from '../contexts/navigation';
  import {
    appState,
    currentStepId,
    documents,
    getDocImage,
    IDocumentInfo,
    selectedDocumentInfo,
  } from '../contexts/app-state';
  import { NavigationButtons } from '../molecules';
  import { getLayoutStyles, getStepConfiguration } from '../ui-packs';
  import { preloadNextStepByCurrent } from '../services/preload-service';
  import { ActionNames, sendButtonClickEvent, VerificationStatuses } from '../utils/event-service';
  import { getFlowConfig } from '../contexts/flows/hooks';

  export let stepId;

  const step = getStepConfiguration($configuration, stepId);
  const flow = getFlowConfig($configuration);
  const style = getLayoutStyles($configuration, step);

  const stepNamespace = step.namespace!;

  let image: string;
  let documentInfo: IDocumentInfo | undefined = undefined;

  $: {
    documentInfo = step.documentInfo || $selectedDocumentInfo;
    if ($documents.length === 0 || !documentInfo) {
      goToPrevStep(currentStepId, $configuration, $currentStepId);
    }
    if (documentInfo) {
      image = getDocImage(documentInfo.type, $documents, 'back');
    }
  }

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
        <T key="title" namespace={stepNamespace} />
      </Title>
    {/if}
    {#if element.type === Elements.Paragraph}
      <Paragraph configuration={element.props}>
        <T key="description" namespace={stepNamespace} />
      </Paragraph>
    {/if}
    {#if element.type === Elements.Photo}
      <Photo configuration={element.props} src={image} />
    {/if}
    {#if element.type === Elements.Image}
      <Image configuration={element.props} />
    {/if}
  {/each}
  <NavigationButtons />
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
