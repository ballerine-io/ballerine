import { ComponentProps, FC } from 'react';
import { Badge, type BadgeVariantProps } from '@ballerine/ui';

import { Heading } from '../../components/Heading/Heading';
import { Alert } from '../../components/Alert/Alert';
import { Container } from '../../components/Container/Container';
import { CallToAction } from '../../components/CallToAction/CallToAction';
import { FaceComparison } from '../../components/FaceComparison/FaceComparison';
import { Details } from '../../components/Details/Details';
import { MultiDocuments } from '../../components/MultiDocuments/MultiDocuments';
import { NestedDetails } from '../../components/NestedDetails/NestedDetails';
import { MapCell } from '../../components/MapCell/MapCell';
import { CaseCallToAction } from '../../components/CaseCallToAction/CaseCallToAction';

const BadgeCell: FC<{
  value: ComponentProps<typeof Badge>['children'];
  props: {
    variant: BadgeVariantProps['variant'];
    size: BadgeVariantProps['size'];
  };
}> = ({ value, props }) => {
  return <Badge {...props}>{value}</Badge>;
};

export const cells = {
  heading: Heading,
  alert: Alert,
  badge: BadgeCell,
  container: Container,
  callToAction: CallToAction,
  faceComparison: FaceComparison,
  details: Details,
  nestedDetails: NestedDetails,
  multiDocuments: MultiDocuments,
  map: MapCell,
  caseCallToAction: CaseCallToAction,
};
