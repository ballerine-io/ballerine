import { test } from 'vitest';
import { createWorkflow } from './create-workflow';

test('temp', () => {
  const service = createWorkflow({
    id: 'clf8xbocb0002zpeid7bq9vgn',
    name: 'kyc',
    version: 1,
    definitionType: 'statechart-json',
    definition: {
      id: 'kyc',
      states: {
        final: {
          type: 'final',
        },
        welcome: {
          on: {
            USER_NEXT_STEP: 'document_selection',
          },
        },
        document_photo: {
          on: {
            USER_NEXT_STEP: 'final',
            USER_PREV_STEP: 'document_selection',
          },
        },
        document_selection: {
          on: {
            USER_NEXT_STEP: 'document_photo',
            USER_PREV_STEP: 'welcome',
          },
        },
      },
      context: {
        documents: [],
      },
      initial: 'welcome',
      predictableActionArguments: true,
    },
    supportedPlatforms: null,
    backend: null,
    persistStates: [
      {
        state: 'document_selection',
        persistence: 'BACKEND',
      },
      {
        state: 'final',
        persistence: 'BACKEND',
      },
    ],
    submitStates: [
      {
        state: 'document_photo',
      },
    ],
    createdAt: '2023-03-15T01:03:37.228Z',
    updatedAt: '2023-03-15T01:03:37.228Z',
    createdBy: 'SYSTEM',
  });
});
