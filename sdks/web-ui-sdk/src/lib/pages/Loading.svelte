<script lang="ts">
  import { toast } from '@zerodevx/svelte-toast';
  import { Elements } from '../contexts/configuration';
  import { FlyingText, Image, Loader } from '../atoms';
  import { configuration } from '../contexts/configuration';
  import {
    currentParams,
    currentStepId,
    documents,
    ISelectedParams,
    IStoreData,
    selectedDocumentInfo,
    selfieUri,
  } from '../contexts/app-state';
  import { sendVerificationUpdateEvent } from '../utils/event-service';
  import { ISendDocumentsResponse, VerificationStatuses } from '../utils/event-service/types';
  import { onDestroy, onMount } from 'svelte';
  import { t } from '../contexts/translation/hooks';
  import { flowUploadLoader } from '../services/analytics';
  import { getFlowConfig, getFlowName } from '../contexts/flows/hooks';
  import { generateParams, getVerificationStatus, verifyDocuments } from '../services/http';
  import { DecisionStatus } from '../contexts/app-state/types';
  import { IDocumentVerificationResponse } from '../services/http/types';
  import { preloadStepById } from '../services/preload-service';
  import { getLayoutStyles, getStepConfiguration } from '../ui-packs';
  import { sendFlowErrorEvent } from '../utils/event-service/utils';

  flowUploadLoader();

  const WAITING_TIME = 1000 * 60 * 3; // 3 minutes

  export let stepId;
  const flowName: string = getFlowName();
  const step = getStepConfiguration($configuration, stepId);
  const style = getLayoutStyles($configuration, step);

  let timeout: NodeJS.Timeout;
  let veryficationTimeout: NodeJS.Timeout;
  let review = false;
  let showText = true;

  const endUserId = $configuration.endUserInfo.id;
  if (!endUserId) {
    console.error('endUserInfo.id is required but was not provided');
  }

  /**
   * Maps resubmission reason codes to the SDK step the user should re-enter at.
   * This enables "smart re-entry" — e.g. FACE_NOT_VISIBLE jumps straight to selfie,
   * DOCUMENT_BACK_MISSING jumps to the back-photo step, etc.
   * Step IDs must match those declared in the flow config passed by the host page.
   */
  const REASON_TARGET_STEP: Record<string, string> = {
    DOCUMENT_BLURRY: 'document-photo',
    DOCUMENT_OBSCURED: 'document-photo',
    DOCUMENT_EXPIRED: 'document-selection',
    FACE_NOT_VISIBLE: 'selfie-start',
    FACE_MISMATCH: 'document-photo',
    DOCUMENT_BACK_MISSING: 'document-photo-back-start',
    DOCUMENT_TYPE_UNSUPPORTED: 'document-selection',
  };

  /**
   * Handle a collection-flow response that contains idvResult directly
   * (no polling needed — the backend processes inline during final-submission).
   */
  const handleCollectionFlowResponse = async (response: IDocumentVerificationResponse) => {
    const params = generateParams(response);
    sendVerificationUpdateEvent(response, response.idvResult === DecisionStatus.APPROVED);

    showText = false;

    if (
      response.idvResult === DecisionStatus.DECLINED ||
      response.idvResult === DecisionStatus.REVIEW
    ) {
      $currentParams = params;
      await preloadStepById($configuration, configuration, 'decline', flowName);
      $currentStepId = 'decline';
    } else if (response.idvResult === DecisionStatus.RESUBMISSION_REQUESTED) {
      // Resolve the smart re-entry target step from the reason code
      const reason = typeof response.reasonCode === 'string' ? response.reasonCode : '';
      const targetStepId = REASON_TARGET_STEP[reason] || undefined;
      // When target is document-selection but no selection step exists, fall back to document-photo
      const hasDocSelection = $configuration.flows?.['mikashboks-kyc']?.steps?.some(
        (s: { name?: string }) => s.name === 'document-selection',
      );
      const resolvedTarget =
        targetStepId === 'document-selection' && !hasDocSelection
          ? 'document-photo'
          : targetStepId;
      $currentParams = { ...params, targetStepId: resolvedTarget } as ISelectedParams;
      await preloadStepById($configuration, configuration, 'resubmission', flowName);
      $currentStepId = 'resubmission';
    } else {
      // Approved or no specific idvResult — treat as success
      $currentParams = params;
      await preloadStepById($configuration, configuration, 'final', flowName);
      $currentStepId = 'final';
    }
  };

  const checkStatus = async (data: ISendDocumentsResponse) => {
    try {
      const response = await getVerificationStatus(endUserId);
      if (response.status === VerificationStatuses.PENDING) {
        veryficationTimeout = setTimeout(() => checkStatus(data), 2000);
        return;
      }

      const params = generateParams(response);
      sendVerificationUpdateEvent(response, response.idvResult === DecisionStatus.APPROVED);

      showText = false;
      if (
        response.idvResult === DecisionStatus.DECLINED ||
        response.idvResult === DecisionStatus.REVIEW
      ) {
        $currentParams = params;
        await preloadStepById($configuration, configuration, 'decline', flowName);
        $currentStepId = 'decline';
      }
      if (response.idvResult === DecisionStatus.RESUBMISSION_REQUESTED) {
        const reason = typeof response.reasonCode === 'string' ? response.reasonCode : '';
        const targetStepId = REASON_TARGET_STEP[reason] || undefined;
        const hasDocSelection = $configuration.flows?.['mikashboks-kyc']?.steps?.some(
          (s: { name?: string }) => s.name === 'document-selection',
        );
        const resolvedTarget =
          targetStepId === 'document-selection' && !hasDocSelection
            ? 'document-photo'
            : targetStepId;
        $currentParams = { ...params, targetStepId: resolvedTarget } as ISelectedParams;
        await preloadStepById($configuration, configuration, 'resubmission', flowName);
        $currentStepId = 'resubmission';
      }
      if (response.idvResult === DecisionStatus.APPROVED) {
        $currentParams = params;
        await preloadStepById($configuration, configuration, 'final', flowName);
        $currentStepId = 'final';
      }
    } catch (error) {
      toast.push(t('general', 'errorDocumentVerification'));
      veryficationTimeout = setTimeout(() => checkStatus(data), 2000);
    }
  };

  const makeRequest = async (data: IStoreData) => {
    let res;
    try {
      res = await verifyDocuments(data);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      toast.push(t('general', 'errorDocuments'));
      console.error('Error sending documents', err);
      $currentParams = { message: err.message } as ISelectedParams;
      await preloadStepById($configuration, configuration, 'error', flowName);
      $currentStepId = 'error';

      sendFlowErrorEvent(err);

      return;
    }

    // Collection-flow mode: verifyDocuments returns IDocumentVerificationResponse directly
    // (not a verificationId string). Handle the response inline — no polling needed.
    // Discriminate by type: collection-flow returns an object, legacy returns a string.
    if (typeof res !== 'string' && typeof res === 'object' && res !== null && 'status' in res) {
      await handleCollectionFlowResponse(res as IDocumentVerificationResponse);
      return;
    }

    // Legacy mode: verifyDocuments returned a verificationId string
    const flowConfig = getFlowConfig($configuration);

    if (flowConfig.syncFlow) {
      checkStatus(res);
      return;
    }

    showText = false;
    await preloadStepById($configuration, configuration, 'final', flowName);
    $currentStepId = 'final';
  };

  onMount(() => {
    const data: IStoreData = {
      docs: $documents,
      selectedDocumentInfo: $selectedDocumentInfo,
      selfie: $selfieUri,
    };

    makeRequest(data);

    timeout = setTimeout(async () => {
      showText = false;
      await preloadStepById($configuration, configuration, 'decline', flowName);
      $currentStepId = 'decline';
    }, WAITING_TIME);
  });

  onDestroy(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
    if (veryficationTimeout) {
      clearTimeout(veryficationTimeout);
    }
  });
</script>

<div class="container" {style}>
  {#if showText}
    {#if !review}
      <div class="text-container">
        <FlyingText
          texts={[
            { text: t('loader', 'text-one'), startTime: 10, endTime: 5000 },
            { text: t('loader', 'text-two'), startTime: 6000, endTime: 'infinity' },
          ]}
        />
      </div>
    {:else}
      <div class="text-container">
        <FlyingText
          texts={[{ text: t('loader', 'text-three'), startTime: 1000, endTime: 'infinity' }]}
        />
      </div>
    {/if}
  {/if}
  {#each step.elements as element}
    {#if element.type === Elements.Image}
      <Image configuration={element.props} />
    {/if}
  {/each}
  <Loader />
</div>

<style>
  .container {
    padding: var(--padding);
    color: var(--color);
    position: relative;
    background: var(--background);
    text-align: center;
    height: 100%;
  }

  .text-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% + -86px));
    z-index: 100;
  }
</style>
