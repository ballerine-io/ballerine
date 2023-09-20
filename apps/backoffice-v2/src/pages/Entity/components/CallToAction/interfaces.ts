export interface ICallToActionProps {
  value: string;
  data: {
    id: string;
    disabled: boolean;
    decision: 'reject' | 'approve' | 'revision' | 'revised';
  };
}
