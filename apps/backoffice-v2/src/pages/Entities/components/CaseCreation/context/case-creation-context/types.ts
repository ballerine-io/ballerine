export interface CaseCreationContextState {
  isMultipleCasesCreation: boolean;
  isOpen: boolean;
}

export interface CaseCreationApi {
  toggleMultiCaseCreation: () => void;
  setOpen: (open: boolean) => void;
}

export type CaseGenerationContext = CaseCreationContextState & CaseCreationApi;
