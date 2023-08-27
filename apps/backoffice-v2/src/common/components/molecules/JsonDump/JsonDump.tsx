import { FunctionComponent } from 'react';

export type Serializable =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<Serializable>
  | Record<string, Serializable>;

export interface IJsonDumpProps {
  json: Serializable;
}

export const JsonDump: FunctionComponent<IJsonDumpProps> = ({ json }) => {
  return (
    <pre>
      <code>{JSON.stringify(json, null, 2)}</code>
    </pre>
  );
};
