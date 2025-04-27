import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/atoms/Table';
import { Dialog } from '@/common/components/molecules/Dialog/Dialog';
import { MotionBadge } from '@/common/components/molecules/MotionBadge/MotionBadge';
import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';
import { ExtendedJson, GenericAsyncFunction } from '@/common/types';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { ICallToActionLegacyProps } from '@/lib/blocks/components/CallToActionLegacy/interfaces';
import { ICallToActionDocumentSelection } from '@/lib/blocks/components/DirectorsCallToAction/interfaces';
import { IEditableDetailsDocument } from '@/lib/blocks/components/EditableDetails/interfaces';
import { TPDFViewerCell } from '@/lib/blocks/components/PDFViewerCell/interfaces';
import { Block } from '@ballerine/blocks';
import { CommonWorkflowStates, GenericFunction, SortDirection } from '@ballerine/common';
import { AnyChildren, AnyObject, Image } from '@ballerine/ui';
import { ColumnDef, TableOptions } from '@tanstack/react-table';
import { ComponentProps, ReactNode } from 'react';

import { ReadOnlyDetail } from '@/common/components/atoms/ReadOnlyDetail/ReadOnlyDetail';
import { EditableDetailsV2 } from '@/common/components/organisms/EditableDetailsV2/EditableDetailsV2';
import { DataTable } from '@ballerine/ui/dist/components/organisms/DataTable/DataTable';

export type TBlockCell = {
  type: 'block';
  props?: {
    className?: string;
  };
  value: Block;
};

export type TContainerCell = {
  type: 'container';
  value: Block;
};

export type THeadingCell = {
  type: 'heading';
  value: ReactNode;
  props?: ComponentProps<'h2'>;
};

export type TSubheadingCell = {
  type: 'subheading';
  value: string;
  props?: ComponentProps<'h3'>;
};

export type TAlertCell = {
  type: 'alert';
  value: string;
};

export type TBadgeCell = {
  type: 'badge';
  value: ComponentProps<typeof MotionBadge>['children'];
  props?: ComponentProps<typeof MotionBadge>;
};

export type TCallToActionLegacyCell = {
  type: 'callToActionLegacy';
  value: {
    text: string | React.ReactNode;
    props: {
      id: string;
      workflow: TWorkflowById;
      disabled: boolean;
      decision: 'reject' | 'approve' | 'revision' | 'revised';
      documentSelection?: ICallToActionDocumentSelection;
      contextUpdateMethod?: 'base' | 'director';
      revisionReasons?: string[];
      rejectionReasons?: string[];
      onReuploadReset?: () => void;
      onDialogClose?: () => void;
    };
  };
};

export type TCallToActionCell = {
  type: 'callToAction';
  value: {
    text: string;
    onClick: GenericFunction | GenericAsyncFunction;
    props?: ComponentProps<typeof MotionButton>;
  };
};

export type TDirectorsCallToActionCell = {
  type: 'directorsCallToAction';
  value: ICallToActionLegacyProps['value'] & {
    props: ICallToActionLegacyProps['value']['props'] & {
      documents: AnyObject[];
      workflow: AnyObject;
      onReset?: () => void;
    };
  };
};

export type TDetailsCell = {
  type: 'details';
  id: string;
  workflowId: string;
  directorId?: string;
  hideSeparator?: boolean;
  documents?: IEditableDetailsDocument[];
  contextUpdateMethod?: 'base' | 'director';
  isSaveDisabled?: boolean;
  value: {
    id: string;
    title: string;
    subtitle?: string;
    data: Array<{
      title: string;
      isEditable: boolean;
      type: string;
      format?: string;
      pattern?: string;
      value: unknown;
      dropdownOptions?: Array<{ label: string; value: string }>;
      dependantOn?: string;
      dependantValue?: string;
      minimum?: string;
      maximum?: string;
    }>;
  };
  props?: {
    config?: {
      sort?: { direction?: SortDirection; predefinedOrder?: string[] };
    };
  };
  onSubmit?: (document: AnyObject) => void;
  isDocumentsV2: boolean;
};

export type TNestedDetailsCell = {
  type: 'nestedDetails';
  id?: string;
  value: {
    data: Array<{
      title: string;
      value: unknown;
    }>;
  };
};

export type TMultiDocumentsCell = {
  type: 'multiDocuments';
  value: {
    isLoading: boolean;
    data: Array<{
      imageUrl: string;
      title: string;
      fileType: string;
    }>;
  };
};

export type TMapCell = {
  type: 'map';
  value:
    | string
    | {
        city: string;
        country: string;
        street: string;
      };
};

export type TCaseCallToActionLegacyCell = {
  type: 'caseCallToActionLegacy';
  value: string;
  data: {
    parentWorkflowId: string;
    childWorkflowId: string;
    childWorkflowContextSchema: NonNullable<
      TWorkflowById['childWorkflows']
    >[number]['workflowDefinition']['contextSchema'];
    disabled: boolean;
    decision:
      | typeof CommonWorkflowStates.REJECTED
      | typeof CommonWorkflowStates.APPROVED
      | typeof CommonWorkflowStates.REVISION;
    isKYC: boolean;
  };
};

export type TTableCell = {
  type: 'table';
  value: {
    caption?: ComponentProps<typeof TableCaption>['children'];
    columns: Array<ColumnDef<unknown>>;
    data: unknown[];
    props?: {
      table?: ComponentProps<typeof Table>;
      header?: ComponentProps<typeof TableHeader>;
      head?: ComponentProps<typeof TableHead>;
      row?: ComponentProps<typeof TableRow>;
      body?: ComponentProps<typeof TableBody>;
      cell?: ComponentProps<typeof TableCell>;
      caption?: ComponentProps<typeof TableCaption>;
    };
    options?: Omit<TableOptions<unknown>, 'getCoreRowModel' | 'data' | 'columns'>;
  };
};

export type TDataTableCell = {
  type: 'dataTable';
  value: ComponentProps<typeof DataTable>;
};

export type TParagraphCell = {
  type: 'paragraph';
  value: ReactNode | ReactNode[];
  props?: ComponentProps<'p'>;
};

export type TDialogCell = {
  type: 'dialog';
  value: ComponentProps<typeof Dialog>;
};

export type TNodeCell = {
  type: 'node';
  value: AnyChildren;
};

export type TReadOnlyDetailsCell = {
  type: 'readOnlyDetails';
  props?: ComponentProps<'div'> & {
    config?: Pick<ComponentProps<typeof ReadOnlyDetail>, 'parse'> & {
      sort?: {
        direction?: SortDirection;
        predefinedOrder?: string[];
      };
    };
  };
  value: Array<{
    label: string;
    value: ExtendedJson;
    props?: Omit<ComponentProps<typeof ReadOnlyDetail>, 'children'>;
  }>;
};

export type TImageCell = {
  type: 'image';
  value: ComponentProps<typeof Image>['src'];
  props: Omit<ComponentProps<typeof Image>, 'src'>;
};

export type TEditableDetailsV2Cell = {
  type: 'editableDetails';
  value: ComponentProps<typeof EditableDetailsV2>['fields'];
  props: Omit<ComponentProps<typeof EditableDetailsV2>, 'fields'>;
};

export type TNoDataCell = {
  type: 'noData';
  value: {
    title: string;
    description: string;
    icon: JSX.Element;
  };
  props: {
    className?: string;
  };
};

export type TCell =
  | TBlockCell
  | TContainerCell
  | THeadingCell
  | TSubheadingCell
  | TAlertCell
  | TBadgeCell
  | TCallToActionLegacyCell
  | TCallToActionCell
  | TDirectorsCallToActionCell
  | TDetailsCell
  | TNestedDetailsCell
  | TMultiDocumentsCell
  | TMapCell
  | TCaseCallToActionLegacyCell
  | TTableCell
  | TDataTableCell
  | TParagraphCell
  | TDialogCell
  | TNodeCell
  | TPDFViewerCell
  | TReadOnlyDetailsCell
  | TImageCell
  | TEditableDetailsV2Cell
  | TNoDataCell;
