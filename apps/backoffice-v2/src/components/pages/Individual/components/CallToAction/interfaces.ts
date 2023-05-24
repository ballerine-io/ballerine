export interface ICallToActionProps {
  value: string;
  data: {
    id: string;
    disabled: boolean;
    approvalStatus: 'rejected' | 'approved' | 'revision';
  };
}
