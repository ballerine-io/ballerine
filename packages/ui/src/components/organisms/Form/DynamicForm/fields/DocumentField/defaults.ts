export const DEFAULT_CREATION_PARAMS = {
  url: '{_app.apiUrl}collection-flow/files',
  method: 'POST',
  headers: {
    Authorization: 'Bearer {_app.accessToken}',
  },
} as const;

export const DEFAULT_UPDATE_PARAMS = {
  url: '{_app.apiUrl}collection-flow/files',
  method: 'PUT',
  headers: {
    Authorization: 'Bearer {_app.accessToken}',
  },
} as const;

export const DEFAULT_DELETION_PARAMS = {
  url: '{_app.apiUrl}collection-flow/files',
  method: 'DELETE',
  headers: {
    Authorization: 'Bearer {_app.accessToken}',
  },
} as const;
