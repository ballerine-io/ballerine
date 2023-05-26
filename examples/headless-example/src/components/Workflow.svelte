<script lang="ts">
  import type { WorkflowOptionsBrowser } from '@ballerine/workflow-browser-sdk';
  import DocumentPhoto from './DocumentPhoto.svelte';
  import DocumentSelection from './DocumentSelection.svelte';
  import ErrorComponent from './Error.svelte';
  import Final from './Final.svelte';
  import Resubmission from './Resubmission.svelte';
  import Success from './Success.svelte';
  import { type ObjectValues, State } from '@/types';
  import Welcome from './Welcome.svelte';
  import { initWorkflowContext } from '@/utils';
  import DocumentReview from './DocumentReview.svelte';
  import { createEventDispatcher } from 'svelte';
  import { DocumentId } from '@/constants';

  const Step = {
    WELCOME: Welcome,
    DOCUMENT_SELECTION: DocumentSelection,
    DOCUMENT_PHOTO: DocumentPhoto,
    DOCUMENT_REVIEW: DocumentReview,
    CERTIFICATE_OF_INCORPORATION: DocumentPhoto,
    CERTIFICATE_OF_INCORPORATION_REVIEW: DocumentReview,
    SELFIE: DocumentPhoto,
    SELFIE_REVIEW: DocumentReview,
    FINAL: Final,
    ERROR: ErrorComponent,
    SUCCESS: Success,
    RESUBMISSION: Resubmission,
  } as const;
  export let workflow: WorkflowOptionsBrowser;
  const dispatch = createEventDispatcher();
  const workflowUpdated = (newWf: unknown) => dispatch('workflow-updated', newWf);
  let workflowService = initWorkflowContext(workflow);

  let snapshot = workflowService?.getSnapshot();
  let currentStep: string = snapshot?.machine?.initial ?? State.WELCOME;
  let step: ObjectValues<typeof Step> = Step[currentStep as keyof typeof Step];
  let stateActionStatus: 'PENDING' | 'ERROR' | 'SUCCESS';
  let error: string;

  const onPrev = (payload: Record<PropertyKey, any>) => () => {
    const context = workflowService.getSnapshot()?.context;

    workflowService.sendEvent({
      type: 'USER_PREV_STEP',
      payload: {
        ...context,
        documents: context?.documents?.map(document => {
          if (document.id !== payload.id) return document;

          return payload;
        }),
      },
    });
  };
  const onSubmit = (payload: Record<PropertyKey, any>) => {
    workflowService.sendEvent({
      type: 'USER_NEXT_STEP',
      payload,
    });
  };
  let initialValues = {
    [DocumentId.ID_CARD]: {
      type: snapshot?.context?.documents?.find(document => document.id === DocumentId.ID_CARD)
        ?.type,
    },
    [DocumentId.SELFIE]: {
      type: snapshot?.context?.documents?.find(document => document.id === DocumentId.SELFIE)?.type,
    },
    [DocumentId.CERTIFICATE_OF_INCORPORATION]: {
      type: snapshot?.context?.documents?.find(
        document => document.id === DocumentId.CERTIFICATE_OF_INCORPORATION,
      )?.type,
    },
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
      document => document?.id === DocumentId.ID_CARD,
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
