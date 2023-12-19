export interface IMultiDocumentsProps {
  value: {
    isLoading: boolean;
    data: Array<{
      imageUrl: string;
      title: string;
      fileType: string;
    }>;
  };
}
