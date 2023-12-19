export interface ICallToActionDocumentOption {
  name: string;
  value: string;
}

export interface ICallToActionDocumentSelection {
  options: ICallToActionDocumentOption[];
  value?: ICallToActionDocumentOption['value'];
  onSelect: (value: ICallToActionDocumentOption['value']) => void;
}
