export interface IBaseEditableDetailsV2Props {
  title: string;
  fields: Array<{
    id?: string;
    title: string;
    value: any;
    props: {
      valueAlias?: any;
      type: string | undefined;
      format: string | undefined;
      isEditable: boolean;
      pattern?: string;
      minimum?: number;
      maximum?: number;
      options?: Array<{
        label: string;
        value: string;
      }>;
    };
    path: string;
    root: string;
  }>;
  parse?: {
    date?: boolean;
    isoDate?: boolean;
    datetime?: boolean;
    boolean?: boolean;
    url?: boolean;
    nullish?: boolean;
  };
  onSubmit: (values: Record<string, any>) => void;
  onEnableIsEditable: () => void;
  onCancel: () => void;
  isEditable: boolean;
  isSaveDisabled: boolean;
}

export interface IEditableDetailsV2PropsWithBlacklist extends IBaseEditableDetailsV2Props {
  blacklist: string[];
  whitelist?: never;
}

export interface IEditableDetailsV2PropsWithWhitelist extends IBaseEditableDetailsV2Props {
  blacklist?: never;
  whitelist: string[];
}

export type TEditableDetailsV2Props =
  | IEditableDetailsV2PropsWithBlacklist
  | IEditableDetailsV2PropsWithWhitelist;
