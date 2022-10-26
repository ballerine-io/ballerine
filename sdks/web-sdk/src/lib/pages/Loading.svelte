<script lang="ts">
  import { toast } from '@zerodevx/svelte-toast';
  import { FlyingText, Loader } from '../atoms';
  import { configuration, Steps } from '../contexts/configuration';
  import { makeStylesFromConfiguration } from '../utils/cssUtils';
  import {
    currentParams,
    currentStepRoute,
    documents,
    ISelectedParams,
    IStoreData,
    selectedDocumentInfo,
    selfieUri,
  } from '../contexts/appState';
  import { DecisionStatus, sendVerificationUpdateEvent } from '../utils/EventService';

  import { ISendDocumentsResponse } from '../utils/EventService/types';
  import { onDestroy, onMount } from 'svelte';
  import { t } from '../contexts/translation/hooks';
  import { flowUploadLoader } from '../services/analytics';
  import { getFlowConfig } from '../contexts/flows/hooks';
  import merge from 'lodash.merge';
  import { layout, loadingStep } from '../defaultConfiguration/theme';
  import { generateParams, getVerificationStatus, verifyDocuments } from '../services/http';

  flowUploadLoader();

  const WAITING_TIME = 1000 * 60 * 3; // 3 minutes

  const step = merge(loadingStep, $configuration.steps[Steps.Loading]);
  const style = makeStylesFromConfiguration(merge(layout, $configuration.layout), step.style);

  let timeout: number;
  let veryficationTimeout: number;
  let dataVerified = false;
  let review = false;
  let showText = true;

  const broofa = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };

  const endUserId = $configuration.endUserInfo.id || broofa();
  const checkStatus = async (data: ISendDocumentsResponse) => {
    try {
      const response = await getVerificationStatus(endUserId);
      if (response.status === 'pending') {
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
        $currentStepRoute = '/decline';
      }
      if (response.idvResult === DecisionStatus.RESUBMISSION_REQUESTED) {
        $currentParams = params;
        $currentStepRoute = '/resubmission';
      }
      if (response.idvResult === DecisionStatus.APPROVED) {
        $currentParams = params;
        $currentStepRoute = '/final';
      }
    } catch (error) {
      toast.push(t('general', 'errorDocumentVerification'));
      veryficationTimeout = setTimeout(() => checkStatus(data), 2000);
    }
  };

  const makeRequest = async (data: IStoreData) => {
    let res;
    try {
      res = await verifyDocuments(data, endUserId, $configuration);
    } catch (error) {
      toast.push(t('general', 'errorDocuments'));
      console.error('Error sending documents', error);
      $currentParams = { message: error } as ISelectedParams;
      $currentStepRoute = '/error';
      return;
    }

    dataVerified = true;
    const flowConfig = getFlowConfig($configuration);
    if (flowConfig.syncFlow) {
      checkStatus(res);
      return;
    }
    showText = false;
    $currentStepRoute = '/final';
  };

  onMount(() => {
    const data: IStoreData = {
      docs: $documents,
      selectedDocumentInfo: $selectedDocumentInfo,
      selfie: $selfieUri,
    };
    makeRequest(data);
    timeout = setTimeout(() => {
      showText = false;
      $currentStepRoute = '/decline';
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
            { text: t('loader', 'text-one'), startTime: 3000, endTime: 5000 },
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
  <Loader />
</div>

<style>
  .container {
    padding: var(--padding);
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
