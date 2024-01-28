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
  import { preloadStepById } from '../services/preload-service';
  import { getLayoutStyles, getStepConfiguration } from '../ui-packs';
  import { broofa } from '../utils/api-utils';
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

  const endUserId = $configuration.endUserInfo.id || broofa();
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
        $currentParams = params;
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
    } catch (error: Error) {
      toast.push(t('general', 'errorDocuments'));
      console.error('Error sending documents', error);
      $currentParams = { message: error } as ISelectedParams;
      await preloadStepById($configuration, configuration, 'error', flowName);
      //$currentStepId = 'error';

      sendFlowErrorEvent(error);

      return;
    }

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
      //$currentStepId = 'decline';
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
