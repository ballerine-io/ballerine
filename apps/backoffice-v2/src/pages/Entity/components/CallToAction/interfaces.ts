export interface ICallToActionDocumentOption {
  name: string;
  value: string;
}

export interface ICallToActionDocumentSelection {
  options: ICallToActionDocumentOption[];
  value?: ICallToActionDocumentOption['value'];
  onSelect: (value: ICallToActionDocumentOption['value']) => void;
}
export interface ICallToActionProps {
  value: {
    text: string;
    props: {
      id: string;
      disabled: boolean;
      decision: 'reject' | 'approve' | 'revision' | 'revised';
      documentSelection?: ICallToActionDocumentSelection;
      contextUpdateMethod?: 'base' | 'director';
      revisionReasons?: string[];
      rejectionReasons?: string[];
      onReuploadReset?: () => void;
      onDialogClose?: () => void;
    };
  };
}
