export interface IMultiDocumentsProps {
  value: {
    isLoading: boolean;
    onOcrPressed: () => void;
    isLoadingOCR: boolean;
    isDocumentEditable: boolean;
    data: Array<{
      imageUrl: string;
      base64: string;
      title: string;
      fileType: string;
    }>;
  };
}
