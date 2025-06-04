import React, { FunctionComponent } from 'react';
import { getSeverityFromRiskScore, Severity, SeverityType } from '@ballerine/common';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { ctw } from '@/common/utils/ctw/ctw';
import {
  Badge,
  severityToClassName,
  severityToTextClassName,
  TextWithNAFallback,
} from '@ballerine/ui';
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
  riskLevels: Record<string, SeverityType>;
}> = ({ riskScore, riskLevels }) => {
  const severity = getSeverityFromRiskScore(riskScore);

  return (
    <Card>
      <CardHeader className={'pb-2 pt-4 font-bold'}>Overall Risk Level</CardHeader>
      <CardContent>
        <div className="mb-8 flex items-center space-x-2">
          {riskScore && typeof riskScore === 'number' && !Number.isNaN(riskScore) ? (
            <>
              <p
                className={ctw(
                  {
                    [severityToTextClassName[
                      (severity as keyof typeof severityToClassName) ?? 'DEFAULT'
                    ]]: riskScore || riskScore === 0,
                  },
                  {
                    'text-destructive': severity === Severity.CRITICAL,
                  },
                  'text-4xl font-bold',
                )}
                checkFalsy={false}
              >
                {typeof riskScore === 'number' && !Number.isNaN(riskScore)
                  ? Math.min(riskScore, 100)
                  : null}
              </p>
              <Badge
                className={ctw(
                  severityToClassName[(severity as keyof typeof severityToClassName) ?? 'DEFAULT'],
                  {
                    'text-background': severity === Severity.CRITICAL,
                  },
                  'min-w-20 rounded-lg font-bold',
                )}
              >
                {titleCase(severity ?? '')} Risk
              </Badge>
            </>
          ) : (
            <div>
              <RiskScoreInProgressSvg />
              <div className="space-y-2">
                <p className="font-medium">Risk Score Calculation Pending</p>
                <p className="text-sm">Waiting for more data to calculate</p>
              </div>
            </div>
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

const RiskScoreInProgressSvg = () => (
  <svg
    width="84"
    height="84"
    viewBox="0 0 84 84"
    fill="none"
    opacity="40%"
    className="mt-2"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M52.9425 33.1159C51.7545 33.1159 50.7825 32.1439 50.7825 30.9559C50.7825 29.7679 51.7545 28.7959 52.9425 28.7959C54.1665 28.7959 55.1025 29.7679 55.1025 30.9559C55.1025 32.1439 54.1665 33.1159 52.9425 33.1159ZM31.0545 33.1519C29.8305 33.1519 28.8945 32.1439 28.8945 30.9919C28.8945 29.8039 29.8665 28.8319 31.0545 28.8319C32.1705 28.8319 33.2145 29.7319 33.2145 30.9919C33.2145 32.1799 32.2425 33.1519 31.0545 33.1519ZM42.0705 33.1519C40.8825 33.1519 39.9105 32.1799 39.9105 30.9919C39.9105 29.7679 40.9185 28.8319 42.0705 28.8319C43.1865 28.8319 44.2305 29.7319 44.2305 30.9919C44.2305 32.1799 43.2585 33.1519 42.0705 33.1519Z"
      fill="url(#paint0_linear_17739_38151)"
    />
    <g clipPath="url(#paint1_angular_17739_38151_clip_path)" data-figma-skip-parse="true">
      <g transform="matrix(0.042 0 0 0.042 42 42)">
        <foreignObject x="-1023.81" y="-1023.81" width="2047.62" height="2047.62">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              background:
                'conic-gradient(from 90deg,rgba(255, 255, 255, 1) 0deg,rgba(0, 0, 0, 1) 180deg,rgba(127, 127, 127, 1) 270deg,rgba(255, 255, 255, 1) 360deg)',
              height: '100%',
              width: '100%',
              opacity: 1,
            }}
          ></div>
        </foreignObject>
      </g>
    </g>
    <path
      opacity="0.2"
      d="M80.9104 42C82.6167 42 84.0118 40.6148 83.8865 38.913C83.1491 28.9026 78.8442 19.4472 71.6985 12.3015C63.822 4.42499 53.1391 8.40978e-07 42 0C30.8609 -8.40978e-07 20.178 4.42499 12.3015 12.3015C5.15582 19.4472 0.850864 28.9026 0.113508 38.913C-0.011841 40.6148 1.38328 42 3.08964 42C4.796 42 6.16543 40.6139 6.31238 38.9139C7.03582 30.5445 10.6845 22.6573 16.6709 16.6709C23.3886 9.95324 32.4998 6.17928 42 6.17928C51.5002 6.17928 60.6114 9.95324 67.3291 16.6709C73.3155 22.6573 76.9642 30.5445 77.6876 38.9139C77.8346 40.6139 79.204 42 80.9104 42Z"
      data-figma-gradient-fill="{&#34;type&#34;:&#34;GRADIENT_ANGULAR&#34;,&#34;stops&#34;:[{&#34;color&#34;:{&#34;r&#34;:0.0,&#34;g&#34;:0.0,&#34;b&#34;:0.0,&#34;:1.0},&#34;position&#34;:0.50},{&#34;color&#34;:{&#34;r&#34;:0.5012207031250,&#34;g&#34;:0.5012207031250,&#34;b&#34;:0.5012207031250,&#34;:1.0},&#34;position&#34;:0.750},{&#34;color&#34;:{&#34;r&#34;:1.0,&#34;g&#34;:1.0,&#34;b&#34;:1.0,&#34;:1.0},&#34;position&#34;:1.0}],&#34;stopsVar&#34;:[{&#34;color&#34;:{&#34;r&#34;:0.0,&#34;g&#34;:0.0,&#34;b&#34;:0.0,&#34;:1.0},&#34;position&#34;:0.50},{&#34;color&#34;:{&#34;r&#34;:0.5012207031250,&#34;g&#34;:0.5012207031250,&#34;b&#34;:0.5012207031250,&#34;:1.0},&#34;position&#34;:0.750},{&#34;color&#34;:{&#34;r&#34;:1.0,&#34;g&#34;:1.0,&#34;b&#34;:1.0,&#34;:1.0},&#34;position&#34;:1.0}],&#34;transform&#34;:{&#34;m00&#34;:84.0,&#34;m01&#34;:5.6469591372745875e-13,&#34;m02&#34;:-2.1449508835758024e-13,&#34;m10&#34;:-2.1963861122648726e-13,&#34;m11&#34;:84.0,&#34;m12&#34;:-4.7561954374941706e-13},&#34;opacity&#34;:1.0,&#34;blendMode&#34;:&#34;NORMAL&#34;,&#34;visible&#34;:true}"
    />
    <path
      d="M3.60283 36.0076C1.89046 35.7404 0.273332 36.9119 0.134661 38.6394C0.129843 38.6995 0.125153 38.7595 0.120593 38.8196C-0.0106458 40.5477 1.40497 41.9561 3.13807 41.958L3.53015 41.9584C5.04671 41.96 6.26647 40.7301 6.38457 39.2182C6.50266 37.7063 5.48864 36.3019 3.99023 36.0681L3.60283 36.0076Z"
      fill="#A1A1A1"
    />
    <defs>
      <clipPath id="paint1_angular_17739_38151_clip_path">
        <path
          opacity="0.2"
          d="M80.9104 42C82.6167 42 84.0118 40.6148 83.8865 38.913C83.1491 28.9026 78.8442 19.4472 71.6985 12.3015C63.822 4.42499 53.1391 8.40978e-07 42 0C30.8609 -8.40978e-07 20.178 4.42499 12.3015 12.3015C5.15582 19.4472 0.850864 28.9026 0.113508 38.913C-0.011841 40.6148 1.38328 42 3.08964 42C4.796 42 6.16543 40.6139 6.31238 38.9139C7.03582 30.5445 10.6845 22.6573 16.6709 16.6709C23.3886 9.95324 32.4998 6.17928 42 6.17928C51.5002 6.17928 60.6114 9.95324 67.3291 16.6709C73.3155 22.6573 76.9642 30.5445 77.6876 38.9139C77.8346 40.6139 79.204 42 80.9104 42Z"
        />
      </clipPath>
      <linearGradient
        id="paint0_linear_17739_38151"
        x1="58"
        y1="28"
        x2="26"
        y2="28"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#A1A1A1" />
      </linearGradient>
    </defs>
  </svg>
);
