export const DEFAULT_ENTITY_FIELD_GROUP_DOCUMENT_REMOVAL_PARAMS = {
  url: '{_app.apiUrl}collection-flow/files',
  method: 'DELETE',
  headers: {
    Authorization: 'Bearer {_app.accessToken}',
  },
} as const;
