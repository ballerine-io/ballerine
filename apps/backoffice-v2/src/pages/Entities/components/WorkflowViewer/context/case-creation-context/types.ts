export interface CaseCreationContextState {
  isMultipleCasesCreation: boolean;
  isOpen: boolean;
}

export interface CaseCreationLogic {
  toggleMultiCaseCreation: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export type CaseCreationContext = CaseCreationContextState & CaseCreationLogic;
