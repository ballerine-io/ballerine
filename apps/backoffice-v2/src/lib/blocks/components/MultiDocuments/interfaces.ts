export interface IMultiDocumentsProps {
  value: {
    isLoading: boolean;
    onOCRClicked: () => void;
    data: Array<{
      imageUrl: string;
      title: string;
      fileType: string;
    }>;
  };
}
