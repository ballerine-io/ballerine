import { Block } from '@ballerine/blocks';
import { ComponentProps, ReactNode } from 'react';
import { MotionBadge } from '@/common/components/molecules/MotionBadge/MotionBadge';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { GenericAsyncFunction, GenericFunction } from '@/common/types';
import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';
import { AnyObject } from '@ballerine/ui';
import { CommonWorkflowStates } from '@ballerine/common';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/atoms/Table';
import { ColumnDef, TableOptions } from '@tanstack/react-table';
import { Dialog } from '@/common/components/molecules/Dialog/Dialog';
import { ICallToActionDocumentSelection } from '@/lib/blocks/components/DirectorsCallToAction/interfaces';
import { ICallToActionLegacyProps } from '@/lib/blocks/components/CallToActionLegacy/interfaces';
import { IEditableDetailsDocument } from '@/lib/blocks/components/EditableDetails/interfaces';

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
  value: string;
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

export type TFaceComparisonCell = {
  type: 'faceComparison';
  value: {
    faceAUrl: string;
    faceBUrl: string;
  };
};

export type TDetailsCell = {
  type: 'details';
  id: string;
  workflowId: string;
  hideSeparator?: boolean;
  documents?: IEditableDetailsDocument[];
  contextUpdateMethod?: 'base' | 'director';
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
  onSubmit?: (document: AnyObject) => void;
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
  };
};

export type TTableCell = {
  type: 'table';
  value: {
    caption?: ComponentProps<typeof TableCaption>['children'];
    columns: Array<ColumnDef<unknown>>;
    data: Array<unknown>;
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

export type TParagraphCell = {
  type: 'paragraph';
  value: ReactNode | ReactNode[];
  props?: ComponentProps<'p'>;
};

export type TDialogCell = {
  type: 'dialog';
  value: ComponentProps<typeof Dialog>;
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
  | TFaceComparisonCell
  | TDetailsCell
  | TNestedDetailsCell
  | TMultiDocumentsCell
  | TMapCell
  | TCaseCallToActionLegacyCell
  | TTableCell
  | TParagraphCell
  | TDialogCell;
