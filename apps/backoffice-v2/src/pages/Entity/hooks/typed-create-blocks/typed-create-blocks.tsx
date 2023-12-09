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
import { ComponentProps } from 'react';
import { MotionBadge } from '@/common/components/molecules/MotionBadge/MotionBadge';
import { ICallToActionDocumentSelection } from '@/pages/Entity/components/DirectorsCallToAction/interfaces';
import { GenericAsyncFunction, GenericFunction } from '@/common/types';
import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';
import { IEditableDetailsDocument } from '@/pages/Entity/components/EditableDetails/interfaces';
import { AnyObject } from '@ballerine/ui';
import { BlockCell } from '@/pages/Entity/components/BlockCell/BlockCell';

export type TCell =
  | {
      id?: string;
      type: 'heading';
      value: string;
      props?: ComponentProps<'h2'>;
    }
  | {
      type: 'badge';
      value: ComponentProps<typeof MotionBadge>['children'];
      props?: ComponentProps<typeof MotionBadge>;
    }
  | {
      type: 'callToAction';
      value: {
        text: string;
        onClick: GenericFunction | GenericAsyncFunction;
        props?: ComponentProps<typeof MotionButton>;
      };
    }
  | {
      type: 'callToActionLegacy';
      value: {
        text: string;
        props: {
          id: string;
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
    }
  | {
      type: 'container';
      value: Block;
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

export const typedCreateBlocks = createBlocks<TCell>;

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

declare module '@ballerine/blocks' {
  interface BlocksClient {
    cells: ReturnType<typeof typedCreateBlocks>;
  }
}
