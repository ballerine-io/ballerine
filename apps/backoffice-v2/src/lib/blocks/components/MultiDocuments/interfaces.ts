export interface IMultiDocumentsProps {
  value: {
    isLoading: boolean;
    onOcrPressed: () => void;
    data: Array<{
      imageUrl: string;
      title: string;
      fileType: string;
    }>;
  };
}
