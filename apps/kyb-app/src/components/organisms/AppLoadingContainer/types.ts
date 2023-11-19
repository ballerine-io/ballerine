import { HTTPError } from 'ky';

export type AppDependency = { isLoading: boolean; error: HTTPError | null };
