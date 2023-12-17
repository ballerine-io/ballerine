import { Block, CellsMap, createBlocks } from '@ballerine/blocks';
import { Heading } from '@/pages/Entity/components/Heading/Heading';
import { Subheading } from '@/pages/Entity/components/Subheading/Subheading';
import { Alert } from '@/pages/Entity/components/Alert/Alert';
import { BadgeCell } from '@/pages/Entity/components/BadgeCell/BadgeCell';
import { Container } from '@/pages/Entity/components/Container/Container';
import { CallToActionLegacy } from '@/pages/Entity/components/CallToActionLegacy/CallToActionLegacy';
import { CallToAction } from '@/pages/Entity/components/CallToAction/CallToAction';
import { DirectorsCallToAction } from '@/pages/Entity/components/DirectorsCallToAction';
import { FaceComparison } from '@/pages/Entity/components/FaceComparison/FaceComparison';
import { Details } from '@/pages/Entity/components/Details/Details';
import { NestedDetails } from '@/pages/Entity/components/NestedDetails/NestedDetails';
import { MultiDocuments } from '@/pages/Entity/components/MultiDocuments/MultiDocuments';
import { MapCell } from '@/pages/Entity/components/MapCell/MapCell';
import { CaseCallToActionLegacy } from '@/pages/Entity/components/CaseCallToActionLegacy/CaseCallToActionLegacy';
import { TableCell } from '@/pages/Entity/components/TableCell/TableCell';
import { Paragraph } from '@/pages/Entity/components/Paragraph/Paragraph';
import { DialogCell } from '@/pages/Entity/components/DialogCell/DialogCell';
import { BlockCell } from '@/pages/Entity/components/BlockCell/BlockCell';
import { ComponentProps } from 'react';
import { MotionBadge } from '@/common/components/molecules/MotionBadge/MotionBadge';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { ICallToActionDocumentSelection } from '@/pages/Entity/components/DirectorsCallToAction/interfaces';
import { GenericAsyncFunction, GenericFunction } from '@/common/types';
import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';
import { ICallToActionLegacyProps } from '@/pages/Entity/components/CallToActionLegacy/interfaces';
import { AnyObject } from '@ballerine/ui';
import { IEditableDetailsDocument } from '@/pages/Entity/components/EditableDetails/interfaces';
import { CommonWorkflowStates } from '@ballerine/common';
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/atoms/Table';
import { ColumnDef, TableOptions } from '@tanstack/react-table';
import { Dialog } from '@/common/components/molecules/Dialog/Dialog';

export type TCell =
  | {
      type: 'block';
      props?: {
        className?: string;
      };
      value: Block;
    }
  | {
      type: 'container';
      value: Block;
    }
  | {
      type: 'heading';
      value: string;
      props?: ComponentProps<'h2'>;
    }
  | {
      type: 'subheading';
      value: string;
      props?: ComponentProps<'h3'>;
    }
  | {
      type: 'alert';
      value: string;
    }
  | {
      type: 'badge';
      value: ComponentProps<typeof MotionBadge>['children'];
      props: ComponentProps<typeof MotionBadge>;
    }
  | {
      type: 'callToActionLegacy';
      text: string;
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
    }
  | {
      type: 'callToAction';
      text: string;
      onClick: GenericFunction | GenericAsyncFunction;
      props?: ComponentProps<typeof MotionButton>;
    }
  | {
      type: 'directorsCallToAction';
      value: ICallToActionLegacyProps['value'] & {
        props: ICallToActionLegacyProps['value']['props'] & {
          documents: AnyObject[];
          workflow: AnyObject;
          onReset?: () => void;
        };
      };
    }
  | {
      type: 'faceComparison';
      value: {
        faceAUrl: string;
        faceBUrl: string;
      };
    }
  | {
      type: 'details';
      id: string;
      workflowId: string;
      hideSeparator?: boolean;
      documents?: IEditableDetailsDocument[];
      contextUpdateMethod?: 'base' | 'director';
      value: {
        id: string;
        title: string;
        subtitle: string;
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
    }
  | {
      type: 'nestedDetails';
      id?: string;
      value: {
        data: Array<{
          title: string;
          value: unknown;
        }>;
      };
    }
  | {
      type: 'multiDocuments';
      value: {
        isLoading: boolean;
        data: Array<{
          imageUrl: string;
          title: string;
          fileType: string;
        }>;
      };
    }
  | {
      type: 'map';
      value:
        | string
        | {
            city: string;
            country: string;
            street: string;
          };
    }
  | {
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
    }
  | {
      type: 'table';
      value: {
        caption?: ComponentProps<typeof TableCaption>['children'];
        columns: Array<ColumnDef<unknown>>;
        data: Array<unknown>;

        // Component props
        props?: {
          table?: ComponentProps<typeof Table>;
          header?: ComponentProps<typeof TableHeader>;
          head?: ComponentProps<typeof TableHead>;
          row?: ComponentProps<typeof TableRow>;
          body?: ComponentProps<typeof TableBody>;
          cell?: ComponentProps<typeof TableCell>;
          caption?: ComponentProps<typeof TableCaption>;
        };
        // react-table options
        options?: Omit<TableOptions<unknown>, 'getCoreRowModel' | 'data' | 'columns'>;
      };
    }
  | {
      type: 'paragraph';
      value: string;
      props?: ComponentProps<'p'>;
    }
  | {
      type: 'dialog';
      value: ComponentProps<typeof Dialog>;
    };

export const createBlocksTyped = () => createBlocks<TCell>();

const blocks = createBlocksTyped();

declare module '@ballerine/blocks' {
  interface BlocksClient {
    cells: typeof blocks;
  }
}

export const cells: CellsMap = {
  heading: Heading,
  subheading: Subheading,
  alert: Alert,
  badge: BadgeCell,
  container: Container,
  callToActionLegacy: CallToActionLegacy,
  callToAction: CallToAction,
  directorsCallToAction: DirectorsCallToAction,
  faceComparison: FaceComparison,
  details: Details,
  nestedDetails: NestedDetails,
  multiDocuments: MultiDocuments,
  map: MapCell,
  caseCallToActionLegacy: CaseCallToActionLegacy,
  table: TableCell,
  paragraph: Paragraph,
  dialog: DialogCell,
  block: BlockCell,
};
