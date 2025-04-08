import { SortDirection } from '@ballerine/common';

export interface IBaseEditableDetailsV2Config {
  parse?: {
    date?: boolean;
    isoDate?: boolean;
    datetime?: boolean;
    boolean?: boolean;
    url?: boolean;
    nullish?: boolean;
  };
  sort?: {
    direction?: SortDirection;
    predefinedOrder?: string[];
  };
  actions: {
    editing: {
      disabled: boolean;
    };
    options: {
      disabled: boolean;
    };
    enableEditing: {
      disabled: boolean;
    };
    reRunChecks: {
      disabled: boolean;
    };
    cancel: {
      disabled: boolean;
    };
    save: {
      disabled: boolean;
    };
  };
  inputTypes?: Record<string, HTMLInputElement['type']>;
}

export interface IEditableDetailsV2ConfigWithBlacklist extends IBaseEditableDetailsV2Config {
  blacklist: string[];
  whitelist?: never;
}

export interface IEditableDetailsV2ConfigWithWhitelist extends IBaseEditableDetailsV2Config {
  blacklist?: never;
  whitelist: string[];
}

export type TEditableDetailsV2Config =
  | IEditableDetailsV2ConfigWithBlacklist
  | IEditableDetailsV2ConfigWithWhitelist;

export interface IEditableDetailsV2Props {
  title?: string;
  fields: Array<{
    id?: string;
    title: string;
    value: any;
    props: {
      valueAlias?: string;
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
  onSubmit: (values: Record<string, any>, toggleOffIsEditable: () => void) => void;
  onEnableIsEditable: (toggleOnIsEditable: () => void) => void;
  onReRunChecks: () => void;
  onCancel: (toggleOffIsEditable: () => void) => void;
  config: TEditableDetailsV2Config;
}
