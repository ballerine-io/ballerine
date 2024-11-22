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

  // TODO: We should have different error status for this to avoid strict comparison to error message
  return errorResponses.every(({ message }) => message === 'No EndUser is set for this token');
};
