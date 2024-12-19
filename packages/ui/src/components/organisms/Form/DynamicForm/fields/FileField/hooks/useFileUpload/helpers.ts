import axios from 'axios';
import get from 'lodash/get';
import { IFileFieldParams } from '../../FileField';

export const formatHeaders = (
  headers: Record<string, string>,
  metadata: Record<string, string> = {},
) => {
  const formattedHeaders: Record<string, string> = {};

  Object.entries(headers).forEach(([key, value]) => {
    let formattedValue = value;
    const matches = value.match(/\{([^}]+)\}/g);

    if (matches) {
      matches.forEach(match => {
        const metadataKey = match.slice(1, -1);

        if (metadata[metadataKey]) {
          formattedValue = formattedValue.replace(match, metadata[metadataKey]);
        }
      });
    }

    formattedHeaders[key] = formattedValue;
  });

  return formattedHeaders;
};

export const uploadFile = async (file: File, params: IFileFieldParams['uploadSettings']) => {
  if (!params) {
    throw new Error('Upload settings are required to upload a file');
  }

  const { url, method = 'POST', headers = {} } = params;

  const formData = new FormData();
  formData.append('file', file);

  const response = await axios({
    method,
    url,
    headers,
    data: formData,
  });

  return get(response.data, params.resultPath);
};
