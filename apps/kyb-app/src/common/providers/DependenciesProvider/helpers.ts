import { isExceptionWillBeHandled } from '@/common/utils/helpers';
import { HTTPError } from 'ky';

interface IErrorBody {
  message: string;
  statusCode: number;
}

export const getJsonErrors = async (errors: HTTPError[]) => {
  const errorResponses: IErrorBody[] = [];

  for (const error of errors) {
    const body = await error.response.clone().json();
    errorResponses.push({
      message: (body as { message: string }).message,
      statusCode: error.response.status,
    });
  }

  return errorResponses;
};

export const isShouldIgnoreErrors = async (errors: HTTPError[]) => {
  const errorResponses = await getJsonErrors(errors);

  return errorResponses.every(error => isExceptionWillBeHandled(error as unknown as HTTPError));
};
