import { createBlocks } from '@ballerine/blocks';

export type TCell =
  | {
      type: 'heading';
      id?: string;
      value: string;
    }
  | {
      type: 'alert';
      value: string;
    }
  | {
      type: 'container';
      id: string;
      value: Array<{
        type: string;
      }>;
    }
  | {
      type: 'callToAction';
      value: string;
      data: {
        id: string;
        disabled: boolean;
        approvalStatus: 'rejected' | 'approved' | 'revision';
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
      value: {
        id?: string;
        title: string;
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
        }>;
      };
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
      id?: string;
      value: {
        country: string;
        city: string;
        street: string;
      };
    };

export const useBlocks = () => {
  return createBlocks<TCell>();
};

declare module '@ballerine/blocks' {
  interface BlocksClient {
    cells: ReturnType<typeof useBlocks>;
  }
}
