export interface IMultiDocumentsProps {
  value: {
    data: Array<{
      imageUrl: string;
      title: string;
      fileType: string;
    }>;
  };
}
