<script lang="ts">
  import { getWorkflowContext } from '../../workflow-sdk/context';
  import { Button, IconButton, IconCloseButton, Image, Paragraph, Title } from '../atoms';
  import { currentStepId, IDocument } from '../contexts/app-state';
  import { appState, documents, selectedDocumentInfo } from '../contexts/app-state/stores';
  import { configuration } from '../contexts/configuration';
  import { Elements } from '../contexts/configuration/types';
  import { getFlowConfig, isNativeCamera } from '../contexts/flows/hooks';
  import { T } from '../contexts/translation';
  import { checkIsCameraAvailable } from '../services/camera-manager';
  import { preloadNextStepByCurrent } from '../services/preload-service';
  import { getLayoutStyles, getStepConfiguration, uiPack } from '../ui-packs';
  import { getDocumentType } from '../utils/documents-utils';
  import { ActionNames, sendButtonClickEvent, VerificationStatuses } from '../utils/event-service';
  import { addDocument, ICameraEvent, nativeCameraHandler } from '../utils/photo-utils';

  export let stepId;

  const step = getStepConfiguration($configuration, stepId);
  const flow = getFlowConfig($configuration);
  const style = getLayoutStyles($configuration, step);

  const documentType = getDocumentType(step, $selectedDocumentInfo);

  $: {
    if (!documentType) workflowService.sendEvent({ type: 'USER_PREV_STEP' });
  }
  const workflowService = getWorkflowContext();
  const stepNamespace = `${step.namespace}.${documentType}`;

  const handleGoToNextStep = async () => {
    const isCameraAvailable = await checkIsCameraAvailable();
    if (!isCameraAvailable) return;

    workflowService.sendEvent({
      type: 'USER_NEXT_STEP',
    });

    // goToNextStep(currentStepId, $configuration, $currentStepId);
  };

  const handler = async (e: ICameraEvent) => {
    if (!e.target) return;
    const image = await nativeCameraHandler(e);
    if (!documentType) {
      throw Error("document context wasn't provided");
    }
    const document: IDocument = { type: documentType, metadata: {}, pages: [] };
    const newDocumentsState: IDocument[] = addDocument(
      document.type,
      image,
      $configuration,
      $uiPack,
      $documents,
      document,
    );
    $documents = newDocumentsState;

    workflowService.sendEvent({
      type: 'USER_NEXT_STEP',
      payload: {
        documents: $documents,
      },
    });

    // goToNextStep(currentStepId, $configuration, $currentStepId);
  };

  preloadNextStepByCurrent($configuration, configuration, $currentStepId);
</script>

<div class="container" {style}>
  {#each step.elements as element}
    {#if element.type === Elements.IconButton}
      <IconButton
        configuration={element.props}
        on:click={() => workflowService.sendEvent({ type: 'USER_PREV_STEP' })}
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
    {#if element.type === Elements.Image}
      <Image configuration={element.props} />
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
        <Button on:click={handleGoToNextStep} configuration={element.props}>
          <T key={'button'} namespace={stepNamespace} />
        </Button>
      </div>
    {/if}
  {/each}
</div>

<style>
  .container {
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
    cursor: pointer;
  }
</style>
