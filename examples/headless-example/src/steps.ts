import Welcome from '@/components/Welcome.svelte';
import DocumentSelection from '@/components/DocumentSelection.svelte';
import DocumentPhoto from '@/components/DocumentPhoto.svelte';
import DocumentReview from '@/components/DocumentReview.svelte';
import Final from '@/components/Final.svelte';
import ErrorComponent from '@/components/Error.svelte';
import Success from '@/components/Success.svelte';
import Resubmission from '@/components/Resubmission.svelte';

export const Step = {
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
