<script lang="ts">
  import type { WorkflowOptionsBrowser } from '@ballerine/workflow-browser-sdk';
  import { type ObjectValues, State } from '@/types';
  import { getDocumentId, initWorkflowContext } from '@/utils';
  import { createEventDispatcher } from 'svelte';
  import { DocumentId } from '@/constants';
  import { Step } from '@/steps';

  export let workflow: WorkflowOptionsBrowser;
  const dispatch = createEventDispatcher();
  const workflowUpdated = (newWf: unknown) => dispatch('workflow-updated', newWf);
  let workflowService = initWorkflowContext(workflow);

  let snapshot = workflowService?.getSnapshot();
  let currentStep: string = snapshot?.machine?.initial ?? State.WELCOME;
  let step: ObjectValues<typeof Step> = Step[currentStep as keyof typeof Step];
  let stateActionStatus: 'PENDING' | 'ERROR' | 'SUCCESS';
  let error: string;

  const makeDocument = ({ id, payload }) => {
    const [category, type, issuerCountry] = id?.split('-') ?? [];

    return {
      category,
      type,
      issuer: {
        country: issuerCountry,
      },
      pages: [
        {
          ballerineFileId: payload?.id,
          type: 'png',
          provider: 'http',
          uri: '',
        },
      ],
    };
  };
  const onPrev = (payload: Record<PropertyKey, any>) => () => {
    const context = workflowService.getSnapshot()?.context;
    const documentId = Object.keys(payload ?? {})?.[0];
    const newDocument = makeDocument({
      id: documentId,
      payload: payload[documentId],
    });
    const newDocuments = !context?.documents?.some(
      document => getDocumentId(document) === documentId,
    )
      ? [...context?.documents, newDocument]
      : context?.documents?.map(document => {
          if (document.id !== documentId) return document;

          return newDocument;
        });
    console.log('newDocuments', newDocuments);

    workflowService.sendEvent({
      type: 'USER_PREV_STEP',
      payload: {
        ...context,
        documents: newDocuments,
      },
    });
  };
  const onSubmit = (payload: Record<PropertyKey, any>) => {
    const context = workflowService.getSnapshot()?.context;
    const documentId = Object.keys(payload ?? {})?.[0];
    const newDocument = makeDocument({
      id: documentId,
      payload: payload[documentId],
    });
    const newDocuments = !context?.documents?.some(
      document => getDocumentId(document) === documentId,
    )
      ? [...context?.documents, newDocument]
      : context?.documents?.map(document => {
          if (document.id !== documentId) return document;

          return newDocument;
        });

    workflowService.sendEvent({
      type: 'USER_NEXT_STEP',
      payload: {
        ...context,
        documents: newDocuments,
      },
    });
  };

  const idCard = snapshot?.context?.documents?.find(
    document => getDocumentId(document) === DocumentId.ID_CARD,
  );
  const selfie = snapshot?.context?.documents?.find(
    document => getDocumentId(document) === DocumentId.SELFIE,
  );
  const certificateOfIncorporation = snapshot?.context?.documents?.find(
    document => getDocumentId(document) === DocumentId.CERTIFICATE_OF_INCORPORATION,
  );

  let initialValues = {
    [DocumentId.ID_CARD]: idCard,
    [DocumentId.SELFIE]: selfie,
    [DocumentId.CERTIFICATE_OF_INCORPORATION]: certificateOfIncorporation,
  };

  let documentId;

  workflowService.subscribe('USER_NEXT_STEP', async data => {
    currentStep = data.state;

    if (currentStep !== 'final') return;

    window.location.reload();
  });

  workflowService.subscribe('USER_PREV_STEP', data => {
    currentStep = data.state;
  });

  workflowService.subscribe('ERROR', payload => {
    console.log('ERROR', payload);
    error = (payload.error as Error).message;
  });

  workflowService.subscribe('HTTP_ERROR', payload => {
    console.log('HTTP_ERROR', payload);
    error = payload.error.message;
  });

  workflowService.subscribe('STATE_ACTION_STATUS', event => {
    console.log('STATE_ACTION_STATUS', event);
    stateActionStatus = event?.payload?.status;
    error = (event?.error as Error)?.message;
  });

  $: {
    currentStep;
    step = Step[currentStep.toUpperCase() as keyof typeof Step];
    snapshot = workflowService?.getSnapshot();
    workflowUpdated(snapshot);
    initialValues[DocumentId.ID_CARD].type = snapshot?.context?.documents?.find(
      document => getDocumentId(document) === DocumentId.ID_CARD,
    )?.type;
    initialValues[DocumentId.SELFIE].type = 'selfie';
    initialValues[DocumentId.CERTIFICATE_OF_INCORPORATION].type = 'certificate-of-incorporation';

    switch (currentStep) {
      case 'document_photo':
      case 'document_review':
        documentId = DocumentId.ID_CARD;
        break;
      case 'selfie':
      case 'selfie_review':
        documentId = DocumentId.SELFIE;
        break;
      case 'certificate_of_incorporation':
      case 'certificate_of_incorporation_review':
        documentId = DocumentId.CERTIFICATE_OF_INCORPORATION;
        break;
      default:
        break;
    }
  }
</script>

<span class="absolute bottom-8 left-8 text-sm text-slate-500">
  {#if stateActionStatus === 'PENDING'}
    Loading...
  {/if}

  {#if stateActionStatus === 'ERROR'}
    {error}
  {/if}

  {#if stateActionStatus === 'SUCCESS'}
    Success
  {/if}
</span>

<svelte:component this={step} {onPrev} {onSubmit} {initialValues} {documentId} />
