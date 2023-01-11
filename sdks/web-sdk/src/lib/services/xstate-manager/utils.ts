import { createMachine } from "xstate";
import { EDocumentType } from "../../contexts/app-state";
import { Steps } from "../../contexts/configuration";

export const flowMachine = createMachine({
  id: 'kyc',
  initial: Steps.Welcome,
  states: {
    [Steps.Welcome]: {
      on: { NEXT: Steps.DocumentSelection }
    },
    [Steps.DocumentSelection]: {
      on: {
        [EDocumentType.ID_CARD]: EDocumentType.ID_CARD,
        [EDocumentType.PASSPORT]: EDocumentType.PASSPORT,
      },
    },
    [EDocumentType.ID_CARD]: {
      initial: Steps.DocumentPhoto,
      on: { PREV: Steps.DocumentSelection },
      states: {
        [Steps.DocumentPhoto]: { on: { NEXT: Steps.CheckDocument } },
        [Steps.CheckDocument]: { on: { NEXT: Steps.DocumentPhoto, PREV: Steps.DocumentPhotoBackStart } },
        [Steps.DocumentPhotoBackStart]: { on: { NEXT: Steps.DocumentPhotoBack, PREV: Steps.CheckDocument } },
        [Steps.DocumentPhotoBack]: { on: { NEXT: Steps.DocumentPhotoBackStart, PREV: Steps.CheckDocumentPhotoBack } },
        [Steps.CheckDocumentPhotoBack]: { on: { PREV: Steps.DocumentPhotoBack } },
      }
    },
    [EDocumentType.PASSPORT]: {
      initial: Steps.DocumentPhoto,
      on: { PREV: Steps.DocumentSelection },
      states: {
        [Steps.DocumentPhoto]: { on: { NEXT: Steps.CheckDocument } },
        [Steps.CheckDocument]: { on: { NEXT: Steps.DocumentPhoto } },
      }
    }
  }
});
