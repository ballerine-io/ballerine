import { env } from '@/env';

export const REDIRECT_URL = `${env.APP_API_URL}/api/v1/salesforce/callback`;
export const AUTHORIZE_URL = 'https://login.salesforce.com/services/oauth2/authorize';
export const GET_ACCESS_TOKEN_URL = 'https://login.salesforce.com/services/oauth2/token';
