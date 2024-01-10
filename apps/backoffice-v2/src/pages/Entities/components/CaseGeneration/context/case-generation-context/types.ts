export interface CaseGenerationContextState {
  isMultipleCasesCreation: boolean;
  isOpen: boolean;
}

export interface CaseGenerationApi {
  toggleMultiCaseCreation: () => void;
  setOpen: (open: boolean) => void;
}

export type CaseGenerationContext = CaseGenerationContextState & CaseGenerationApi;
