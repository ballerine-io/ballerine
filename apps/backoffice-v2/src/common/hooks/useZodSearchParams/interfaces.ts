import qs from 'qs';

export interface ISerializedSearchParams {
  serializer?: (searchParams: Record<string, unknown>) => string;
  deserializer?: (searchParams: string) => qs.ParsedQs;
}
