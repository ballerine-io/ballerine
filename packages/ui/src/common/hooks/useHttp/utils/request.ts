import { AnyObject } from '@/common/types';
import { formatString } from '@/components/organisms/Form/DynamicForm/utils/format-string';
import axios, { AxiosRequestConfig } from 'axios';
import { IHttpParams } from '../types';
import { formatHeaders } from './format-headers';

export type TReuqestParams = Omit<IHttpParams, 'resultPath'>;

export const request = async (
  request: TReuqestParams,
  metadata: AnyObject = {},
  data?: any,
  params?: AnyObject,
) => {
  const { url: _url, headers = {}, method, timeout = 5000 } = request;

  const formattedUrl = formatString(_url, { ...metadata, ...params });

  const formattedHeaders = formatHeaders(headers, metadata);

  try {
    const config: AxiosRequestConfig = {
      url: formattedUrl,
      method,
      headers: formattedHeaders,
      data,
      timeout,
      withCredentials: true,
    };

    const response = await axios(config);

    return response.data;
  } catch (error) {
    console.error('Failed to perform request.', error);

    throw error;
  }
};
