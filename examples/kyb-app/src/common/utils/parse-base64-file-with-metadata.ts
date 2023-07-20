export interface FileWithMetadata {
  name: string;
  type: string;
  file: string;
}

export const parseBase64FileWithMetadata = (base64: string): FileWithMetadata => {
  const parseResult = JSON.parse(atob(base64)) as FileWithMetadata;

  return parseResult;
};
