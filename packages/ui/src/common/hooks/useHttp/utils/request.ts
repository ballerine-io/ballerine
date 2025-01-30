import { AnyObject } from '@/common/types';
import { formatString } from '@/components/organisms/Form/DynamicForm/utils/format-string';
import axios from 'axios';
import { IHttpParams } from '../types';
import { formatHeaders } from './format-headers';

export type TReuqestParams = Omit<IHttpParams, 'resultPath'>;

export const request = async (request: TReuqestParams, metadata: AnyObject = {}, data?: any) => {
  const { url, headers = {}, method } = request;

  const formattedUrl = formatString(url, metadata);
  const formattedHeaders = formatHeaders(headers, metadata);

  try {
    const response = await axios({
      url: formattedUrl,
      method,
      headers: formattedHeaders,
      data,
    });

    return response.data;
  } catch (error) {
    console.error('Failed to perform request.', error);

    throw error;
  }
};
