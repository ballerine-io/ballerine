import qs from 'qs';

export interface IUseZodSearchParams {
  serializer?: (searchParams: Record<string, unknown>) => string;
  deserializer?: (searchParams: string) => qs.ParsedQs;
}
