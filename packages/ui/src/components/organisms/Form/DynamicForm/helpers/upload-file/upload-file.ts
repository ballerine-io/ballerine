import axios from 'axios';
import get from 'lodash/get';
import { IFileFieldParams } from '../../fields';
import { IDocumentFieldParams } from '../../fields/DocumentField';

export const uploadFile = async (
  file: File,
  params: IDocumentFieldParams['uploadSettings'] | IFileFieldParams['uploadSettings'],
) => {
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
