import React, { FunctionComponent, ReactNode, useCallback, useMemo } from 'react';
import { Tabs } from '@/common/components/organisms/Tabs/Tabs';
import { TabsList } from '@/common/components/organisms/Tabs/Tabs.List';
import { TabsTrigger } from '@/common/components/organisms/Tabs/Tabs.Trigger';
import { TabsContent } from '@/common/components/organisms/Tabs/Tabs.Content';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button, buttonVariants } from '@/common/components/atoms/Button/Button';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { z } from 'zod';
import { Badge } from '@ballerine/ui';
import { ctw } from '@/common/utils/ctw/ctw';
import { BusinessReportStatus } from '@/domains/business-reports/fetchers';
import dayjs from 'dayjs';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { WarningFilledSvg } from '@/common/components/atoms/icons';
import { CheckCircle } from '@/common/components/atoms/CheckCircle/CheckCircle';
import { DataTable } from '@/common/components/organisms/DataTable/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';
import { useBusinessReportByIdQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportByIdQuery/useBusinessReportByIdQuery';
import { getSeverityFromRiskScore } from '@/common/utils/get-severity-from-risk-score';
import { severityToClassName, severityToTextClassName } from '@/common/constants';
import { titleCase } from 'string-ts';
import { Severity, TSeverity } from '@/common/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/atoms/Table';
import { ScrollArea } from '@/common/components/molecules/ScrollArea/ScrollArea';

const RiskIndicator = ({
  title,
  to,
  violations,
}: {
  title: string;
  to: string;
  violations: Array<{
    label: string;
    severity: string;
  }>;
}) => {
  return (
    <div>
      <h3 className="mb-3 space-x-4 font-bold text-slate-500">
        <span>{title}</span>
        <Link
          className={buttonVariants({
            variant: 'link',
            className: 'h-[unset] cursor-pointer !p-0 !text-blue-500',
          })}
          to={to}
        >
          View
        </Link>
      </h3>
      <ul className="list-inside list-disc">
        {!!violations?.length &&
          violations.map(violation => (
            <li key={violation.label} className="flex list-none items-center text-slate-500">
              <WarningFilledSvg
                className={ctw('me-3 mt-px', {
                  'text-slate-300 [&>:not(:first-child)]:stroke-background':
                    violation.severity === 'low',
                })}
                width={'20'}
                height={'20'}
              />
              {violation.label}
            </li>
          ))}
        {!violations?.length && (
          <li className="flex list-none items-center text-slate-500">
            <CheckCircle
              size={18}
              className={`stroke-background`}
              containerProps={{
                className: 'me-3 bg-success',
              }}
            />
            No violations found
          </li>
        )}
      </ul>
    </div>
  );
};

const BusinessReportSummary: FunctionComponent<{
  summary: string;
  riskLevels: {
    legalRisk: TSeverity;
    chargebackRisk: TSeverity;
    reputationRisk: TSeverity;
    transactionLaunderingRisk: TSeverity;
  };
  riskIndicators: Array<{
    title: string;
    to: string;
    violations: Array<{
      label: string;
      severity: string;
    }>;
  }>;
  riskScore: number;
  recommendations: string[];
}> = ({ riskIndicators, summary, riskLevels, riskScore, recommendations }) => {
  const severity = getSeverityFromRiskScore(riskScore);

  return (
    <div className={'grid grid-cols-[340px_1fr] gap-8'}>
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
                  'min-w-20 rounded-lg font-bold',
                )}
              >
                {titleCase(severity ?? '')} Risk
              </Badge>
            )}
          </div>
          <Table>
            <TableHeader className={'[&_tr]:border-b-0'}>
              <TableRow className={'hover:bg-[unset]'}>
                <TableHead className={'h-0 ps-0 font-bold text-foreground'}>Risk Type</TableHead>
                <TableHead className={'h-0 ps-0 font-bold text-foreground'}>Risk Level</TableHead>
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
                    )}
                  >
                    {titleCase(riskLevel ?? '')}
                  </TableCell>
                </TableRow>
              ))}
              {!Object.keys(riskLevels ?? {}).length && (
                <TableRow>
                  <TableCell colSpan={2} className={'ps-0'}>
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className={'pt-4 font-bold'}>Merchant Risk Summary</CardHeader>
        <CardContent>{summary ?? 'No summary found.'}</CardContent>
      </Card>
      <Card className={'col-span-full'}>
        <CardHeader className={'pt-4 font-bold'}>Risk Indicators</CardHeader>
        <CardContent className={'grid grid-cols-3 gap-4'}>
          {riskIndicators?.map(riskIndicator => (
            <RiskIndicator
              key={riskIndicator.title}
              title={riskIndicator.title}
              to={riskIndicator.to}
              violations={riskIndicator.violations}
            />
          ))}
        </CardContent>
      </Card>
      <Card className={'col-span-full'}>
        <CardHeader className={'pt-4 font-bold'}>Recommendations</CardHeader>
        <CardContent>
          <ul className={'space-y-2'}>
            {!!recommendations?.length &&
              recommendations.map(recommendation => (
                <li key={recommendation} className={'flex list-none items-center'}>
                  <CheckCircle
                    size={20}
                    className={`stroke-transparent`}
                    containerProps={{
                      className: 'me-3 bg-info/20',
                    }}
                  />
                  {recommendation}
                </li>
              ))}
            {!recommendations?.length && (
              <li className={'flex list-none items-center'}>
                <CheckCircle
                  size={20}
                  className={`stroke-transparent`}
                  containerProps={{
                    className: 'me-3 bg-info/20',
                  }}
                />
                No recommendations found.
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export const Analysis: FunctionComponent<{
  companyActivityAnalysis: string[];
  companyReputationAnalysis: string[];
  violations: Array<{
    label: string;
    severity: string;
  }>;
}> = ({ companyActivityAnalysis, companyReputationAnalysis, violations }) => {
  return (
    <div className={'space-y-8'}>
      <Card>
        <CardHeader className={'pt-4 font-bold'}>Risk Indicators</CardHeader>
        <CardContent>
          <ul className="list-inside list-disc">
            {!!violations?.length &&
              violations.map(violation => (
                <li key={violation.label} className="flex list-none items-center text-slate-500">
                  <WarningFilledSvg
                    className={ctw('me-3 mt-px', {
                      'text-slate-300 [&>:not(:first-child)]:stroke-background':
                        violation.severity === Severity.MEDIUM,
                    })}
                    width={'20'}
                    height={'20'}
                  />
                  {violation.label}
                </li>
              ))}
            {!violations?.length && (
              <li className="flex list-none items-center text-slate-500">
                <CheckCircle
                  size={18}
                  className={`stroke-background`}
                  containerProps={{
                    className: 'me-3 bg-success',
                  }}
                />
                No violations found
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className={'pt-4 font-bold'}>Company Activity Assessment</CardHeader>
        <CardContent>
          <ol className={'ps-4'}>
            {companyActivityAnalysis.map(warning => (
              <li key={warning} className={'list-decimal'}>
                {warning}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className={'pt-4 font-bold'}>Company Reputation Analysis</CardHeader>
        <CardContent>
          <ol className={'ps-4'}>
            {companyReputationAnalysis.map(warning => (
              <li key={warning} className={'list-decimal'}>
                {warning}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export const WebsitesCompany: FunctionComponent = () => {
  const companyActivityAnalysis = [
    '"Adolescentm.com is a fraudulent website that lures victims through deceptive promotions."',
    '"Adolescentm.com has a safety score of 0 out of 100."',
    '"Highly unusual and suspicious lack of accounts on Adolescentm.com."',
  ];
  const companyReputationAnalysis = [
    '"Adolescentm.com is a fraudulent website that lures victims through deceptive promotions."',
    '"Adolescentm.com has a safety score of 0 out of 100."',
    '"Highly unusual and suspicious lack of accounts on Adolescentm.com."',
  ];
  const violations = [
    {
      label: 'IP Infringement',
      severity: 'high',
    },
  ] as const satisfies ReadonlyArray<{
    label: string;
    severity: string;
  }>;

  return (
    <Analysis
      companyActivityAnalysis={companyActivityAnalysis}
      companyReputationAnalysis={companyReputationAnalysis}
      violations={violations}
    />
  );
};

export const WebsiteLineOfBusiness: FunctionComponent = () => {
  const companyActivityAnalysis = [
    '"Adolescentm.com is a fraudulent website that lures victims through deceptive promotions."',
    '"Adolescentm.com has a safety score of 0 out of 100."',
    '"Highly unusual and suspicious lack of accounts on Adolescentm.com."',
  ];
  const companyReputationAnalysis = [
    '"Adolescentm.com is a fraudulent website that lures victims through deceptive promotions."',
    '"Adolescentm.com has a safety score of 0 out of 100."',
    '"Highly unusual and suspicious lack of accounts on Adolescentm.com."',
  ];
  const violations = [
    {
      label: 'IP Infringement',
      severity: 'high',
    },
  ] as const satisfies ReadonlyArray<{
    label: string;
    severity: string;
  }>;

  return (
    <Analysis
      companyActivityAnalysis={companyActivityAnalysis}
      companyReputationAnalysis={companyReputationAnalysis}
      violations={violations}
    />
  );
};

export const WebsiteCredibility: FunctionComponent = () => {
  const companyActivityAnalysis = [
    '"Adolescentm.com is a fraudulent website that lures victims through deceptive promotions."',
    '"Adolescentm.com has a safety score of 0 out of 100."',
    '"Highly unusual and suspicious lack of accounts on Adolescentm.com."',
  ];
  const companyReputationAnalysis = [
    '"Adolescentm.com is a fraudulent website that lures victims through deceptive promotions."',
    '"Adolescentm.com has a safety score of 0 out of 100."',
    '"Highly unusual and suspicious lack of accounts on Adolescentm.com."',
  ];
  const violations = [
    {
      label: 'IP Infringement',
      severity: 'high',
    },
  ] as const satisfies ReadonlyArray<{
    label: string;
    severity: string;
  }>;

  return (
    <Analysis
      companyActivityAnalysis={companyActivityAnalysis}
      companyReputationAnalysis={companyReputationAnalysis}
      violations={violations}
    />
  );
};

export const AdsAndSocialMedia: FunctionComponent = () => {
  const companyActivityAnalysis = [
    '"Adolescentm.com is a fraudulent website that lures victims through deceptive promotions."',
    '"Adolescentm.com has a safety score of 0 out of 100."',
    '"Highly unusual and suspicious lack of accounts on Adolescentm.com."',
  ];
  const companyReputationAnalysis = [
    '"Adolescentm.com is a fraudulent website that lures victims through deceptive promotions."',
    '"Adolescentm.com has a safety score of 0 out of 100."',
    '"Highly unusual and suspicious lack of accounts on Adolescentm.com."',
  ];
  const violations = [
    {
      label: 'IP Infringement',
      severity: 'high',
    },
  ] as const satisfies ReadonlyArray<{
    label: string;
    severity: string;
  }>;

  return (
    <Analysis
      companyActivityAnalysis={companyActivityAnalysis}
      companyReputationAnalysis={companyReputationAnalysis}
      violations={violations}
    />
  );
};

export const EcosystemAndTransactions: FunctionComponent = () => {
  const violations = [
    {
      label: 'Illegal Substances',
      severity: 'high',
    },
  ] as const satisfies ReadonlyArray<{
    label: string;
    severity: string;
  }>;
  const data = [
    {
      matchedName: 'Email Address',
      relatedNodeType: 'info@3irdeyeplants.com',
      relatedNode: 'info@3irdeyeplants.com',
      indicators: {
        label: 'Illegal Substances',
        severity: 'high',
      },
    },
    {
      matchedName: 'adpey.com',
      relatedNodeType: 'Phone Number',
      relatedNode: '+86 15869188024',
    },
    {
      matchedName: 'trypunk.com',
      relatedNodeType: 'Phone Number',
      relatedNode: '+86 15869188024',
    },
    {
      matchedName: 'swimsuitmenu.com',
      relatedNodeType: 'Phone Number',
      relatedNode: '+86 15869188024',
    },
  ];
  const columnHelper = createColumnHelper<{
    matchedName: string;
    relatedNodeType: string;
    relatedNode: string;
    indicators: {
      label: string;
      severity: string;
    };
  }>();
  const columns = [
    columnHelper.display({
      id: 'index',
      cell: info => {
        const index = info.cell.row.index + 1;

        return <TextWithNAFallback className={`ps-8`}>{index}</TextWithNAFallback>;
      },
      header: 'Match',
    }),
    columnHelper.accessor('matchedName', {
      header: 'Matched Name',
      cell: info => {
        const matchedName = info.getValue();

        return <TextWithNAFallback>{matchedName}</TextWithNAFallback>;
      },
    }),
    columnHelper.accessor('relatedNodeType', {
      header: 'Related Node Type',
      cell: info => {
        const relatedNodeType = info.getValue();

        return <TextWithNAFallback>{relatedNodeType}</TextWithNAFallback>;
      },
    }),
    columnHelper.accessor('relatedNode', {
      header: 'Related Node',
      cell: info => {
        const relatedNode = info.getValue();

        return <TextWithNAFallback>{relatedNode}</TextWithNAFallback>;
      },
    }),
    columnHelper.accessor('indicators', {
      header: 'Indicators',
      cell: info => {
        const indicators = info.getValue();

        return (
          <div className={'flex items-center'}>
            {indicators && (
              <WarningFilledSvg
                className={ctw('me-3 mt-px', {
                  'text-slate-300 [&>:not(:first-child)]:stroke-background':
                    indicators?.severity === 'low',
                })}
                width={'20'}
                height={'20'}
              />
            )}
            <TextWithNAFallback>{indicators?.label}</TextWithNAFallback>
          </div>
        );
      },
    }),
  ];

  return (
    <div className={'space-y-8'}>
      <Card>
        <CardHeader className={'pt-4 font-bold'}>Risk Indicators</CardHeader>
        <CardContent>
          <ul className="list-inside list-disc">
            {!!violations?.length &&
              violations.map(violation => (
                <li key={violation.label} className="flex list-none items-center text-slate-500">
                  <WarningFilledSvg
                    className={ctw('me-3 mt-px', {
                      'text-slate-300 [&>:not(:first-child)]:stroke-background':
                        violation.severity.toUpperCase() === Severity.MEDIUM,
                    })}
                    width={'20'}
                    height={'20'}
                  />
                  {violation.label}
                </li>
              ))}
            {!violations.length && (
              <li className="flex list-none items-center text-slate-500">
                <CheckCircle
                  size={18}
                  className={`stroke-background`}
                  containerProps={{
                    className: 'me-3 bg-success',
                  }}
                />
                No violations found
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className={'pt-4 font-bold'}>Ecosystem</CardHeader>
        <CardContent>
          <DataTable
            data={data}
            columns={columns}
            options={{
              enableSorting: false,
            }}
            props={{ scroll: { className: 'h-full' }, cell: { className: '!p-0' } }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export const MerchantMonitoringBusinessReport: FunctionComponent = () => {
  const { businessReportId } = useParams();
  const { data: businessReport } = useBusinessReportByIdQuery({
    id: businessReportId ?? '',
  });
  const websitesCompanyAnalysis = useMemo(
    () =>
      businessReport?.report?.data?.summary?.riskIndicatorsByDomain?.companyNameViolations?.map(
        ({ name, riskLevel }) => ({
          label: name,
          severity: riskLevel,
        }),
      ),
    [businessReport?.report?.data?.summary?.riskIndicatorsByDomain?.companyNameViolations],
  );
  const adsAndSocialMediaAnalysis = useMemo(
    () =>
      businessReport?.report?.data?.summary?.riskIndicatorsByDomain?.adsAndSocialViolations?.map(
        ({ name, riskLevel }) => ({
          label: name,
          severity: riskLevel,
        }),
      ),
    [businessReport?.report?.data?.summary?.riskIndicatorsByDomain?.adsAndSocialViolations],
  );
  const websiteLineOfBusinessAnalysis = useMemo(
    () =>
      businessReport?.report?.data?.summary?.riskIndicatorsByDomain?.lineOfBusinessViolations?.map(
        ({ name, riskLevel }) => ({
          label: name,
          severity: riskLevel,
        }),
      ),
    [businessReport?.report?.data?.summary?.riskIndicatorsByDomain?.lineOfBusinessViolations],
  );
  const ecosystemAndTransactionsAnalysis = useMemo(
    () =>
      businessReport?.report?.data?.summary?.riskIndicatorsByDomain?.ecosystemViolations?.map(
        ({ name, riskLevel }) => ({
          label: name,
          severity: riskLevel,
        }),
      ),
    [businessReport?.report?.data?.summary?.riskIndicatorsByDomain?.ecosystemViolations],
  );
  const websiteCredibilityAnalysis = useMemo(
    () =>
      businessReport?.report?.data?.summary?.riskIndicatorsByDomain?.tldViolations?.map(
        ({ name, riskLevel }) => ({
          label: name,
          severity: riskLevel,
        }),
      ),
    [businessReport?.report?.data?.summary?.riskIndicatorsByDomain?.tldViolations],
  );
  const riskIndicators = [
    {
      title: "Website's Company Analysis",
      to: '?activeTab=websitesCompany',
      violations: websitesCompanyAnalysis ?? [],
    },
    {
      title: 'Website Credibility Analysis',
      to: '?activeTab=websiteCredibility',
      violations: websiteCredibilityAnalysis,
    },
    {
      title: 'Ads and Social Media Analysis',
      to: '?activeTab=adsAndSocialMedia',
      violations: adsAndSocialMediaAnalysis ?? [],
    },
    {
      title: 'Website Line of Business Analysis',
      to: '?activeTab=websiteLineOfBusiness',
      violations: websiteLineOfBusinessAnalysis ?? [],
    },
    {
      title: 'Ecosystem and Transactions Analysis View',
      to: '?activeTab=ecosystemAndTransactions',
      violations: ecosystemAndTransactionsAnalysis ?? [],
    },
  ] as const satisfies ReadonlyArray<{
    title: string;
    to: string;
    violations: Array<{
      label: string;
      severity: string;
    }>;
  }>;
  const tabs = [
    {
      label: 'Summary',
      value: 'summary',
      content: (
        <BusinessReportSummary
          summary={businessReport?.report?.data?.summary?.summary}
          riskScore={businessReport?.report?.data?.summary?.riskScore}
          riskIndicators={riskIndicators}
          recommendations={businessReport?.report?.data?.summary?.recommendations}
          riskLevels={businessReport?.report?.data?.summary?.riskLevels}
        />
      ),
    },
    {
      label: "Website's Company",
      value: 'websitesCompany',
      content: <WebsitesCompany />,
    },
    {
      label: 'Website Line of Business',
      value: 'websiteLineOfBusiness',
      content: <WebsiteLineOfBusiness />,
    },
    {
      label: 'Website Credibility',
      value: 'websiteCredibility',
      content: <WebsiteCredibility />,
    },
    {
      label: 'Ecosystem and Transactions',
      value: 'ecosystemAndTransactions',
      content: <EcosystemAndTransactions />,
    },
    {
      label: 'Ads and Social Media',
      value: 'adsAndSocialMedia',
      content: <AdsAndSocialMedia />,
    },
  ] as const satisfies ReadonlyArray<{
    label: string;
    value: string;
    content: ReactNode | ReactNode[];
  }>;
  const tabsValues = tabs.map(tab => tab.value);
  const MerchantMonitoringBusinessReportSearchSchema = z.object({
    activeTab: z
      .enum(
        // @ts-expect-error - zod doesn't like we are using `Array.prototype.map`
        tabsValues,
      )
      .catch(tabsValues[0]!),
  });
  const [{ activeTab }] = useZodSearchParams(MerchantMonitoringBusinessReportSearchSchema);
  const navigate = useNavigate();
  const onNavigateBack = useCallback(() => {
    const previousPath = sessionStorage.getItem(
      'merchant-monitoring:business-report:previous-path',
    );

    if (!previousPath) {
      navigate('../');

      return;
    }

    navigate(previousPath);
    sessionStorage.removeItem('merchant-monitoring:business-report:previous-path');
  }, [navigate]);
  const statusToBadgeData = {
    [BusinessReportStatus.COMPLETED]: { variant: 'info', text: 'Manual Review' },
    [BusinessReportStatus.IN_PROGRESS]: { variant: 'violet', text: 'In-progress' },
  } as const;

  return (
    <section className="flex h-full flex-col px-6 pb-6 pt-4">
      <div>
        <Button
          variant={'ghost'}
          onClick={onNavigateBack}
          className={'mb-6 flex items-center space-x-[1px] pe-3 ps-1 font-semibold'}
        >
          <ChevronLeft size={18} /> <span>Back</span>
        </Button>
      </div>
      <h2 className="pb-4 text-2xl font-bold">{businessReport?.business?.companyName}</h2>
      <div className={`flex space-x-8`}>
        <div className={`flex items-center pb-4`}>
          <span className={`me-4 text-sm leading-6 text-slate-400`}>Status</span>
          <Badge
            variant={
              statusToBadgeData[businessReport?.status as keyof typeof statusToBadgeData]?.variant
            }
            className={ctw(`text-sm font-bold`, {
              'bg-info/20 text-info': businessReport?.status === BusinessReportStatus.COMPLETED,
            })}
          >
            {statusToBadgeData[businessReport?.status as keyof typeof statusToBadgeData]?.text}
          </Badge>
        </div>
        <div>
          <span className={`me-2 text-sm leading-6 text-slate-400`}>Created at</span>
          {businessReport?.createdAt &&
            dayjs(new Date(businessReport?.createdAt)).format('HH:mm MMM Do, YYYY')}
        </div>
      </div>
      <Tabs defaultValue={activeTab} className="w-full" key={activeTab}>
        <TabsList className={'mb-4'}>
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} asChild>
              <Link
                to={{
                  search: `?activeTab=${tab.value}`,
                }}
              >
                {tab.label}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollArea orientation={'vertical'} className={'h-[75vh]'}>
          {tabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </ScrollArea>
      </Tabs>
    </section>
  );
};
