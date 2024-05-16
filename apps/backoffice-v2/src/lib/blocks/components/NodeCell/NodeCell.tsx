import { ExtractCellProps } from '@ballerine/blocks';
import { FunctionComponent } from 'react';

export const NodeCell: FunctionComponent<ExtractCellProps<'node'>> = ({ value }) => <>{value}</>;
