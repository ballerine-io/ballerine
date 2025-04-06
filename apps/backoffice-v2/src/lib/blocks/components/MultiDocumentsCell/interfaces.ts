export interface IMultiDocumentsProps {
  value: {
    isLoading: boolean;
    onOcrPressed: () => void;
    isLoadingOCR: boolean;
    isDocumentEditable: boolean;
    data: Array<{
      imageUrl: string;
      title: string;
      fileType: string;
    }>;
  };
}
