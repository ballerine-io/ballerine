import React, { FunctionComponent } from 'react';
import { Severity, TSeverity } from '@/common/types';
import { getSeverityFromRiskScore } from '@/common/utils/get-severity-from-risk-score';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';
import { ctw } from '@/common/utils/ctw/ctw';
import { severityToClassName, severityToTextClassName } from '@/common/constants';
import { Badge } from '@ballerine/ui';
import { titleCase } from 'string-ts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/atoms/Table';

export const OverallRiskLevel: FunctionComponent<{
  riskScore: number;
  riskLevels: Record<string, TSeverity>;
}> = ({ riskScore, riskLevels }) => {
  const severity = getSeverityFromRiskScore(riskScore);

  return (
    <Card>
      <CardHeader className={'pb-2 pt-4 font-bold'}>Overall Risk Level</CardHeader>
      <CardContent>
        <div className="mb-8 flex items-center space-x-2">
          <TextWithNAFallback
            className={ctw(
              {
                [severityToTextClassName[
                  (severity?.toUpperCase() as keyof typeof severityToClassName) ?? 'DEFAULT'
                ]]: riskScore || riskScore === 0,
              },
              {
                'text-destructive': severity === Severity.CRITICAL,
              },
              'text-4xl font-bold',
            )}
            checkFalsy={false}
          >
            {riskScore}
          </TextWithNAFallback>
          {(riskScore || riskScore === 0) && (
            <Badge
              className={ctw(
                severityToClassName[
                  (severity?.toUpperCase() as keyof typeof severityToClassName) ?? 'DEFAULT'
                ],
                {
                  'text-background': severity === Severity.CRITICAL,
                },
                'min-w-20 rounded-lg font-bold',
              )}
            >
              {titleCase(severity ?? '')} Risk
            </Badge>
          )}
        </div>
        {!!Object.keys(riskLevels ?? {}).length && (
          <Table>
            <TableHeader className={'[&_tr]:border-b-0'}>
              <TableRow className={'hover:bg-[unset]'}>
                <TableHead className={'h-0 ps-0 font-bold text-foreground'}>Risk Type</TableHead>
                <TableHead className={'h-0 min-w-[9ch] ps-0 font-bold text-foreground'}>
                  Risk Level
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(riskLevels ?? {}).map(([riskType, riskLevel]) => (
                <TableRow
                  key={`${riskType}:${riskLevel}`}
                  className={'border-b-0 hover:bg-[unset]'}
                >
                  <TableCell className={'pb-0 ps-0'}>{titleCase(riskType ?? '')}</TableCell>
                  <TableCell
                    className={ctw(
                      'pb-0 ps-0 font-bold',
                      severityToTextClassName[
                        riskLevel.toUpperCase() as keyof typeof severityToTextClassName
                      ],
                      {
                        'text-destructive': riskLevel === Severity.CRITICAL,
                      },
                    )}
                  >
                    <TextWithNAFallback>{titleCase(riskLevel ?? '')}</TextWithNAFallback>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
