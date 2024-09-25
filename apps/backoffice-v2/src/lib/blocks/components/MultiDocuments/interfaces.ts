export interface IMultiDocumentsProps {
  value: {
    isLoading: boolean;
    onOcrPressed: () => void;
    isLoadingOCR: boolean;
    data: Array<{
      imageUrl: string;
      title: string;
      fileType: string;
    }>;
  };
}
