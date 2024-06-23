import React, {
  ComponentProps,
  FunctionComponent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { Show } from '@/common/components/atoms/Show/Show';
import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';
import { CardFooter } from '@/common/components/atoms/Card/Card.Footer';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ctw } from '@/common/utils/ctw/ctw';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/atoms/Table';
import { titleCase } from 'string-ts';
import { Button } from '@/common/components/atoms/Button/Button';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

const hslToRgb = ({
  hue,
  saturation,
  lightness,
}: {
  hue: number;
  saturation: number;
  lightness: number;
}) => {
  const baseSaturation = saturation / 100;
  const baseLightness = lightness / 100;

  const hueFactor = (number: number) => (number + hue / 30) % 12;
  const chroma = baseSaturation * Math.min(baseLightness, 1 - baseLightness);
  const colorComponent = (number: number) =>
    baseLightness -
    chroma * Math.max(Math.min(hueFactor(number) - 3, 9 - hueFactor(number), 1), -1);

  return [
    Math.floor(colorComponent(0) * 255),
    Math.floor(colorComponent(8) * 255),
    Math.floor(colorComponent(4) * 255),
  ];
};
const rgbToHsl = ({ red, green, blue }: { red: number; green: number; blue: number }) => {
  const baseRed = red / 255;
  const baseGreen = green / 255;
  const baseBlue = blue / 255;

  const max = Math.max(baseRed, baseGreen, baseBlue);
  const min = Math.min(baseRed, baseGreen, baseBlue);

  let hue = (max + min) / 2;
  let saturation = (max + min) / 2;
  const lightness = (max + min) / 2;

  if (max === min) {
    hue = saturation = 0; // achromatic
  }

  if (max !== min) {
    const difference = max - min;

    saturation = lightness > 0.5 ? difference / (2 - max - min) : difference / (max + min);

    switch (max) {
      case baseRed:
        hue = (baseGreen - baseBlue) / difference + (baseGreen < baseBlue ? 6 : 0);

        break;
      case baseGreen:
        hue = (baseBlue - baseRed) / difference + 2;

        break;
      case baseBlue:
        hue = (baseRed - baseGreen) / difference + 4;

        break;
    }

    hue *= 60;
  }

  return [hue, saturation * 100, lightness * 100];
};

const baseColorHsl = rgbToHsl({
  red: 0,
  green: 122,
  blue: 255,
});

const valueToColor = ({
  value,
  maxValue,
  lightnessOffset,
}: {
  value: number;
  maxValue: number;
  lightnessOffset: number;
}) => {
  const [baseHue, baseSaturation, baseLightness] = baseColorHsl;

  // Calculate the ratio of value to maxValue
  const valueRatio = value / maxValue;

  // Calculate the new lightness based on the value ratio and the lightness offset
  const lightness = baseLightness + lightnessOffset * (1 - valueRatio);

  const [red, green, blue] = hslToRgb({
    hue: baseHue,
    saturation: baseSaturation,
    lightness,
  });

  return `${red}, ${green}, ${blue}`;
};

const filters = [
  {
    id: 'ckl1y5e0x0000wxrmsgft7bf0',
    name: 'Merchant Onboarding',
    value: 8,
    riskLevels: {
      low: 2,
      medium: 3,
      high: 3,
      critical: 1,
    },
  },
  {
    id: 'ckl1y5e0x0002wxrmnd8j9rb7',
    name: 'Tier 2 Account',
    value: 4,
    riskLevels: {
      low: 1,
      medium: 4,
      high: 2,
      critical: 4,
    },
  },
];

export const assignColorToItem = <
  TItem extends Record<PropertyKey, unknown> & {
    id: string;
    name: string;
    value: number;
  },
>(
  items: TItem[],
) => {
  const highestValue = Math.max(...items.map(({ value }) => value));
  const valueCounts = new Map();
  const baseLightnessOffset = 32; // Base lightness offset for all items
  const duplicateLightnessOffsetStep = 8; // Additional step size for duplicates

  // Count the occurrences of each value
  items.forEach(({ value }) => {
    valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
  });

  const valueIndexMap = new Map(); // To track the current index for each value

  // Assign colors based on perturbed values in a single loop
  return items.map(item => {
    let lightnessOffset = baseLightnessOffset;

    if (item.value === highestValue) {
      return {
        ...item,
        color: '0, 122, 255',
      };
    }

    const count = valueCounts.get(item.value);

    if (count > 1) {
      const currentIndex = valueIndexMap.get(item.value) || 0;

      lightnessOffset += currentIndex * duplicateLightnessOffsetStep; // Add additional offset for duplicates

      valueIndexMap.set(item.value, currentIndex + 1); // Increment the index for the next duplicate
    }

    return {
      ...item,
      color: valueToColor({
        value: item.value,
        maxValue: highestValue,
        lightnessOffset,
      }),
    };
  });
};

export const UserStats: FunctionComponent<{
  fullName: string;
}> = ({ fullName }) => {
  const filtersWithColors = useMemo(
    () =>
      assignColorToItem(filters)
        ?.slice()
        ?.sort((a, b) => b.value - a.value),
    [filters],
  );
  const assignedFilters = useMemo(
    () => filtersWithColors?.reduce((acc, filter) => acc + filter.value, 0),
    [filtersWithColors],
  );
  const visibleCasesAssignedToYouByWorkflowAmount = 4;
  const visibleCasesAssignedToYouByWorkflow = useMemo(
    () => filtersWithColors?.slice(0, visibleCasesAssignedToYouByWorkflowAmount),
    [filtersWithColors],
  );
  const stats = [
    {
      title: 'Cases Assigned to you',
      stat: <span className={'text-2xl font-bold'}>12</span>,
      description: 'Out of 300 active cases',
    },
    {
      title: 'Cases Assigned to you by Workflow',
      stat: (
        <div className={'flex space-x-5 pt-3'}>
          <PieChart width={70} height={70}>
            <text
              x={35}
              y={37}
              textAnchor="middle"
              dominantBaseline="middle"
              className={ctw('font-bold', {
                'text-sm': assignedFilters?.toString().length >= 5,
              })}
            >
              {assignedFilters}
            </text>
            <Pie
              data={filters}
              cx={30}
              cy={30}
              innerRadius={28}
              outerRadius={35}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              cornerRadius={9999}
            >
              {filtersWithColors?.map(filter => {
                return (
                  <Cell
                    key={filter.id}
                    style={{
                      fill: `rgb(${filter.color})`,
                    }}
                  />
                );
              })}
            </Pie>
          </PieChart>
          <ul className={'w-full max-w-sm'}>
            {visibleCasesAssignedToYouByWorkflow?.map(({ name, color, value }) => {
              return (
                <li key={name} className={'flex items-center space-x-4 text-xs'}>
                  <span
                    className="flex h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: `rgb(${color})`,
                    }}
                  />
                  <div className={'flex w-full justify-between'}>
                    <span className={'text-slate-500'}>{name}</span>
                    <span>{value}</span>
                  </div>
                </li>
              );
            })}
            <Show when={filters?.length > visibleCasesAssignedToYouByWorkflowAmount}>
              <li className={'ms-6 text-xs'}>
                {filters?.length - visibleCasesAssignedToYouByWorkflowAmount} More
              </li>
            </Show>
          </ul>
        </div>
      ),
    },
    {
      title: 'Cases Resolved by you',
      stat: <span className={'text-2xl font-bold'}>31</span>,
      description: 'During the selected time period',
    },
  ] satisfies ReadonlyArray<{
    title: string;
    stat: ReactNode | ReactNode[];
    description?: string;
  }>;

  return (
    <div>
      <TextWithNAFallback as={'h5'} className={'mb-4 font-bold'}>
        {fullName ? `${fullName}'s stats` : ''}
      </TextWithNAFallback>
      <div className={'grid grid-cols-3 gap-6'}>
        {stats.map(({ title, stat, description }) => (
          <div key={title} className={'min-h-[10.125rem] rounded-xl bg-[#F6F6F6] p-2'}>
            <Card className={'flex h-full flex-col px-3'}>
              <CardHeader className={'pb-1'}>{title}</CardHeader>
              <CardContent>{stat}</CardContent>
              <Show when={!!description}>
                <CardFooter className={'mt-auto'}>
                  <p className={'text-sm text-slate-500'}>{description}</p>
                </CardFooter>
              </Show>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PortfolioRiskStats: FunctionComponent = () => {
  const [parent] = useAutoAnimate<HTMLTableSectionElement>();
  const [sorting, setSorting] = useState<'asc' | 'desc'>('desc');
  const onSort = useCallback(
    (sort: 'desc' | 'asc') => () => {
      setSorting(sort);
    },
    [],
  );
  const sortedData = useMemo(
    () =>
      [
        { riskType: 'Scam and fraud', amount: 1230 },
        { riskType: 'IP Rights Infringement', amount: 751 },
        { riskType: 'Missing Terms and Conditions', amount: 471 },
        { riskType: 'Counterfeit Goods', amount: 280 },
        { riskType: 'Sanctions', amount: 87 },
      ]
        ?.slice()
        .sort((a, b) => {
          if (sorting === 'asc') {
            return a.amount - b.amount;
          }

          return b.amount - a.amount;
        }),
    [sorting],
  );
  const widths = useMemo(() => {
    const maxValue = Math.max(...sortedData.map(item => item.amount), 0);

    return sortedData.map(item =>
      item.amount === 0 ? 0 : Math.max((item.amount / maxValue) * 100, 2),
    );
  }, [sortedData]);

  return (
    <div>
      <h5 className={'mb-4 font-bold'}>Portfolio Risk Stats</h5>
      <div className={'grid grid-cols-3 gap-6'}>
        <div className={'min-h-[27.5rem] rounded-xl bg-[#F6F6F6] p-2'}>
          <Card className={'flex h-full flex-col px-3'}>
            <CardHeader className={'pb-1'}>Portfolio Risk</CardHeader>
            <CardContent>
              <div className={'flex flex-col items-center space-y-4 pt-3'}>
                <PieChart width={184} height={184}>
                  <text
                    x={92}
                    y={92}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={'text-lg font-bold'}
                  >
                    103
                  </text>
                  <Pie
                    data={[
                      { name: 'Low Risk', value: 2 },
                      { name: 'Medium Risk', value: 3 },
                      { name: 'High Risk', value: 4 },
                      { name: 'Critical Risk', value: 5 },
                    ]}
                    cx={87}
                    cy={87}
                    innerRadius={78}
                    outerRadius={92}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    cornerRadius={9999}
                  >
                    <Cell className={'fill-success'} />
                    <Cell className={'fill-warning'} />
                    <Cell className={'fill-destructive'} />
                    <Cell className={'fill-foreground'} />
                  </Pie>
                </PieChart>
                <ul className={'flex w-full max-w-sm flex-col space-y-2'}>
                  <li className={'flex items-center space-x-4 border-b py-1 text-xs'}>
                    <span className="flex h-2 w-2 rounded-full bg-success" />
                    <div className={'flex w-full justify-between'}>
                      <span className={'text-slate-500'}>Low Risk</span>
                      <span>15</span>
                    </div>
                  </li>
                  <li className={'flex items-center space-x-4 border-b py-1 text-xs'}>
                    <span className="flex h-2 w-2 rounded-full bg-warning" />
                    <div className={'flex w-full justify-between'}>
                      <span className={'text-slate-500'}>Medium Risk</span>
                      <span>50</span>
                    </div>
                  </li>
                  <li className={'flex items-center space-x-4 border-b py-1 text-xs'}>
                    <span className="flex h-2 w-2 rounded-full bg-destructive" />
                    <div className={'flex w-full justify-between'}>
                      <span className={'text-slate-500'}>High Risk</span>
                      <span>32</span>
                    </div>
                  </li>
                  <li className={'flex items-center space-x-4 border-b py-1 text-xs'}>
                    <span className="flex h-2 w-2 rounded-full bg-foreground" />
                    <div className={'flex w-full justify-between'}>
                      <span className={'text-slate-500'}>Critical Risk</span>
                      <span>12</span>
                    </div>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className={'grid grid-cols-2 gap-3'}>
          <div className={'col-span-full min-h-[13.125rem] rounded-xl bg-[#F6F6F6] p-2'}>
            <Card className={'flex h-full flex-col px-3'}>
              <CardHeader className={'pb-1'}>Merchant Monitoring Risk</CardHeader>
              <CardContent>
                <div className={'flex space-x-5 pt-3'}>
                  <PieChart width={104} height={104}>
                    <text
                      x={52}
                      y={52}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={ctw('font-bold', {
                        'text-sm': 103?.toString().length >= 5,
                      })}
                    >
                      103
                    </text>
                    <Pie
                      data={[
                        { name: 'Low Risk', value: 2 },
                        { name: 'Medium Risk', value: 3 },
                        { name: 'High Risk', value: 4 },
                        { name: 'Critical Risk', value: 5 },
                      ]}
                      cx={47}
                      cy={47}
                      innerRadius={43}
                      outerRadius={52}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      cornerRadius={9999}
                    >
                      <Cell className={'fill-success'} />
                      <Cell className={'fill-warning'} />
                      <Cell className={'fill-destructive'} />
                      <Cell className={'fill-foreground'} />
                    </Pie>
                  </PieChart>
                  <ul className={'w-full max-w-sm '}>
                    <li className={'flex items-center space-x-4  text-xs'}>
                      <span className="flex h-2 w-2 rounded-full bg-success" />
                      <div className={'flex w-full justify-between'}>
                        <span className={'text-slate-500'}>Low Risk</span>
                        <span>15</span>
                      </div>
                    </li>
                    <li className={'flex items-center space-x-4 text-xs'}>
                      <span className="flex h-2 w-2 rounded-full bg-warning" />
                      <div className={'flex w-full justify-between'}>
                        <span className={'text-slate-500'}>Medium Risk</span>
                        <span>50</span>
                      </div>
                    </li>
                    <li className={'flex items-center space-x-4 text-xs'}>
                      <span className="flex h-2 w-2 rounded-full bg-destructive" />
                      <div className={'flex w-full justify-between'}>
                        <span className={'text-slate-500'}>High Risk</span>
                        <span>32</span>
                      </div>
                    </li>
                    <li className={'flex items-center space-x-4 text-xs'}>
                      <span className="flex h-2 w-2 rounded-full bg-foreground" />
                      <div className={'flex w-full justify-between'}>
                        <span className={'text-slate-500'}>Critical Risk</span>
                        <span>12</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className={'col-span-full min-h-[13.125rem] rounded-xl bg-[#F6F6F6] p-2'}>
            <Card className={'flex h-full flex-col px-3'}>
              <CardHeader className={'pb-1'}>Merchant Onboarding Risk</CardHeader>
              <CardContent>
                <div className={'flex space-x-5 pt-3'}>
                  <PieChart width={104} height={104}>
                    <text
                      x={52}
                      y={52}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={ctw('font-bold', {
                        'text-sm': 103?.toString().length >= 5,
                      })}
                    >
                      103
                    </text>
                    <Pie
                      data={[
                        { name: 'Low Risk', value: 2 },
                        { name: 'Medium Risk', value: 3 },
                        { name: 'High Risk', value: 4 },
                        { name: 'Critical Risk', value: 5 },
                      ]}
                      cx={47}
                      cy={47}
                      innerRadius={43}
                      outerRadius={52}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      cornerRadius={9999}
                    >
                      <Cell className={'fill-success'} />
                      <Cell className={'fill-warning'} />
                      <Cell className={'fill-destructive'} />
                      <Cell className={'fill-foreground'} />
                    </Pie>
                  </PieChart>
                  <ul className={'w-full max-w-sm '}>
                    <li className={'flex items-center space-x-4  text-xs'}>
                      <span className="flex h-2 w-2 rounded-full bg-success" />
                      <div className={'flex w-full justify-between'}>
                        <span className={'text-slate-500'}>Low Risk</span>
                        <span>15</span>
                      </div>
                    </li>
                    <li className={'flex items-center space-x-4 text-xs'}>
                      <span className="flex h-2 w-2 rounded-full bg-warning" />
                      <div className={'flex w-full justify-between'}>
                        <span className={'text-slate-500'}>Medium Risk</span>
                        <span>50</span>
                      </div>
                    </li>
                    <li className={'flex items-center space-x-4 text-xs'}>
                      <span className="flex h-2 w-2 rounded-full bg-destructive" />
                      <div className={'flex w-full justify-between'}>
                        <span className={'text-slate-500'}>High Risk</span>
                        <span>32</span>
                      </div>
                    </li>
                    <li className={'flex items-center space-x-4 text-xs'}>
                      <span className="flex h-2 w-2 rounded-full bg-foreground" />
                      <div className={'flex w-full justify-between'}>
                        <span className={'text-slate-500'}>Critical Risk</span>
                        <span>12</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className={'min-h-[10.125rem] rounded-xl bg-[#F6F6F6] p-2'}>
          <Card className={'flex h-full flex-col px-3'}>
            <CardHeader className={'pb-1'}>Risk Indicators</CardHeader>
            <CardContent>
              <div className={'mb-7 flex items-end space-x-2'}>
                <span className={'text-3xl font-semibold'}>10,234</span>
                <span className={'text-sm leading-7 text-slate-500'}>Total indicators</span>
              </div>
              <div className={'mb-6'}>
                <Button
                  variant={'ghost'}
                  className={ctw(
                    'gap-x-2 rounded-none border-b border-b-slate-400 text-slate-400',
                    {
                      'border-b-[rgb(0,122,255)] text-[rgb(0,122,255)] hover:text-[rgb(0,122,255)]':
                        sorting === 'desc',
                    },
                  )}
                  onClick={onSort('desc')}
                >
                  <TrendingUp />
                  Highest First
                </Button>
                <Button
                  variant={'ghost'}
                  className={ctw(
                    'gap-x-2 rounded-none border-b border-b-slate-400 text-slate-400',
                    {
                      'border-b-[rgb(0,122,255)] text-[rgb(0,122,255)] hover:text-[rgb(0,122,255)]':
                        sorting === 'asc',
                    },
                  )}
                  onClick={onSort('asc')}
                >
                  <TrendingDown />
                  Lowest First
                </Button>
              </div>
              <Table>
                <TableHeader className={'[&_tr]:border-b-0'}>
                  <TableRow className={'hover:bg-[unset]'}>
                    <TableHead className={'h-0 ps-0 font-bold text-foreground'}>
                      Indicator
                    </TableHead>
                    <TableHead className={'h-0 ps-0 font-bold text-foreground'}>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody ref={parent}>
                  {sortedData?.map(({ riskType, amount }, index) => (
                    <TableRow key={riskType} className={'border-b-0 hover:bg-[unset]'}>
                      <TableCell
                        className={ctw('pb-0 ps-0', {
                          'pt-2': index !== 0,
                        })}
                      >
                        <div className={'relative h-full p-1'}>
                          <div
                            className={`absolute inset-y-0 rounded bg-blue-200 transition-all`}
                            style={{
                              width: `${widths[index]}%`,
                            }}
                          />
                          <span className={'relative z-50 ms-4'}>{titleCase(riskType ?? '')}</span>
                        </div>
                      </TableCell>
                      <TableCell className={'pb-0 ps-0'}>{amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
export const WorkflowStats: FunctionComponent = () => {
  const tags = [
    {
      id: 'ckl1y5e0x0000wxrmsgft7bf0',
      name: 'Pending manual review',
      value: 15,
    },
    {
      id: 'ckl1y5e0x0002wxrmnd8j9rb7',
      name: 'Collection Flow',
      value: 5,
    },
    {
      id: 'ckl1y5e0x0002wxrmnd8j9rb7',
      name: 'Revisions',
      value: 3,
    },
    {
      id: 'ckl1y5e0x0002wxrmnd8j9rb7',
      name: 'Awaiting 3rd party data',
      value: 2,
    },
  ];
  const tagsWithColors = useMemo(
    () =>
      assignColorToItem(tags)
        ?.slice()
        ?.sort((a, b) => b.value - a.value),
    [tags],
  );
  const assignedTags = useMemo(
    () => tagsWithColors?.reduce((acc, filter) => acc + filter.value, 0),
    [tagsWithColors],
  );
  const visibleActiveCasesAmount = 4;
  const visibleActiveCases = useMemo(
    () => tagsWithColors?.slice(0, visibleActiveCasesAmount),
    [tagsWithColors],
  );

  const filtersPendingManualReview = [
    {
      id: 'ckl1y5e0x0000wxrmsgft7bf0',
      name: 'Merchant Onboarding',
      value: 15,
    },
  ];
  const filtersPendingManualReviewWithColors = useMemo(
    () =>
      assignColorToItem(filtersPendingManualReview)
        ?.slice()
        ?.sort((a, b) => b.value - a.value),
    [filtersPendingManualReview],
  );
  const assignedCasesPendingManualReview = useMemo(
    () => filtersPendingManualReviewWithColors?.reduce((acc, filter) => acc + filter.value, 0),
    [filtersPendingManualReviewWithColors],
  );
  const visibleCasesPendingManualReviewAmount = 4;
  const visibleCasesPendingManualReview = useMemo(
    () => filtersPendingManualReviewWithColors?.slice(0, visibleActiveCasesAmount),
    [filtersPendingManualReviewWithColors],
  );
  const assignees = [
    {
      name: 'John Doe',
      value: 12,
    },
    {
      name: 'Jane Doe',
      value: 2,
    },
    {
      name: 'Bob Smith',
      value: 1,
    },
  ];
  const CustomLegend: ComponentProps<typeof Legend>['content'] = ({ payload }) => (
    <div className={'mb-6 flex items-end'}>
      <ul className="ms-auto">
        {payload?.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center gap-x-2">
            <span
              className="mt-1 flex h-2 w-2 rounded-full"
              style={{
                backgroundColor: `rgb(0, 122, 255)`,
              }}
            />
            {titleCase(entry.value ?? '')}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div>
      <h5 className={'mb-4 font-bold'}>Workflow Stats</h5>
      <div className={'grid grid-cols-3 gap-6'}>
        <div className={'col-span-2 min-h-[26.875rem] rounded-xl bg-[#F6F6F6] p-2'}>
          <Card className={'flex h-full flex-col px-3'}>
            <CardHeader className={'pb-1'}>Resolved Cases by Month</CardHeader>
            <CardContent>
              <p className={'mb-8 text-slate-400'}>
                The IUCN Red List has assessed only a small share of the total known species in the
                world.
              </p>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={[
                    { month: 'Jan 22', category1: 650 },
                    { month: 'Feb 22', category1: 1300 },
                    { month: 'Mar 22', category1: 2600 },
                    { month: 'Apr 22', category1: 300 },
                    { month: 'May 22', category1: 1300 },
                    { month: 'Jun 22', category1: 1950 },
                    { month: 'Jul 22', category1: 100 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  barSize={46}
                >
                  <CartesianGrid vertical={false} strokeDasharray="0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend verticalAlign="top" align={'right'} content={<CustomLegend />} />
                  <Bar dataKey="category1" fill="rgb(0, 122, 255)" radius={10} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div className={'grid grid-cols-2 gap-3'}>
          <div className={'col-span-full min-h-[12.375rem] rounded-xl bg-[#F6F6F6] p-2'}>
            <Card className={'flex h-full flex-col px-3'}>
              <CardHeader className={'pb-1'}>Active Cases</CardHeader>
              <CardContent>
                <div className={'flex space-x-5 pt-3'}>
                  <PieChart width={70} height={70}>
                    <text
                      x={35}
                      y={37}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={ctw('font-bold', {
                        'text-sm': assignedTags?.toString().length >= 5,
                      })}
                    >
                      {assignedTags}
                    </text>
                    <Pie
                      data={tags}
                      cx={30}
                      cy={30}
                      innerRadius={28}
                      outerRadius={35}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      cornerRadius={9999}
                    >
                      {tagsWithColors?.map(filter => {
                        return (
                          <Cell
                            key={filter.id}
                            style={{
                              fill: `rgb(${filter.color})`,
                            }}
                          />
                        );
                      })}
                    </Pie>
                  </PieChart>
                  <ul className={'w-full max-w-sm'}>
                    {visibleActiveCases?.map(({ name, color, value }) => {
                      return (
                        <li key={name} className={'flex items-center space-x-4 text-xs'}>
                          <span
                            className="flex h-2 w-2 rounded-full"
                            style={{
                              backgroundColor: `rgb(${color})`,
                            }}
                          />
                          <div className={'flex w-full justify-between'}>
                            <span className={'text-slate-500'}>{name}</span>
                            <span>{value}</span>
                          </div>
                        </li>
                      );
                    })}
                    <Show when={tags?.length > visibleActiveCasesAmount}>
                      <li className={'ms-6 text-xs'}>
                        {tags?.length - visibleActiveCasesAmount} More
                      </li>
                    </Show>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className={'col-span-full min-h-[12.375rem] rounded-xl bg-[#F6F6F6] p-2'}>
            <Card className={'flex h-full flex-col px-3'}>
              <CardHeader className={'pb-1'}>Cases Pending Manual Review</CardHeader>
              <CardContent>
                <div className={'flex space-x-5 pt-3'}>
                  <PieChart width={70} height={70}>
                    <text
                      x={35}
                      y={37}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={ctw('font-bold', {
                        'text-sm': assignedCasesPendingManualReview?.toString().length >= 5,
                      })}
                    >
                      {assignedCasesPendingManualReview}
                    </text>
                    <Pie
                      data={filtersPendingManualReview}
                      cx={30}
                      cy={30}
                      innerRadius={28}
                      outerRadius={35}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      cornerRadius={9999}
                    >
                      {filtersPendingManualReviewWithColors?.map(filter => {
                        return (
                          <Cell
                            key={filter.id}
                            style={{
                              fill: `rgb(${filter.color})`,
                            }}
                          />
                        );
                      })}
                    </Pie>
                  </PieChart>
                  <ul className={'w-full max-w-sm'}>
                    {visibleCasesPendingManualReview?.map(({ name, color, value }) => {
                      return (
                        <li key={name} className={'flex items-center space-x-4 text-xs'}>
                          <span
                            className="flex h-2 w-2 rounded-full"
                            style={{
                              backgroundColor: `rgb(${color})`,
                            }}
                          />
                          <div className={'flex w-full justify-between'}>
                            <span className={'text-slate-500'}>{name}</span>
                            {value}
                          </div>
                        </li>
                      );
                    })}
                    <Show
                      when={
                        filtersPendingManualReview?.length > visibleCasesPendingManualReviewAmount
                      }
                    >
                      <li className={'ms-6 text-xs'}>
                        {filtersPendingManualReview?.length - visibleCasesPendingManualReviewAmount}{' '}
                        More
                      </li>
                    </Show>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className={'min-h-[12.375rem] rounded-xl bg-[#F6F6F6] p-2'}>
          <Card className={'flex h-full flex-col px-3'}>
            <CardHeader className={'pb-1'}>Assigned Cases by User</CardHeader>
            <CardContent>
              <ul className={'w-full max-w-sm'}>
                {assignees?.map(({ name, value }) => {
                  return (
                    <li
                      key={name}
                      className={'flex items-center justify-between space-x-4 text-xs'}
                    >
                      <span className={'text-slate-500'}>{name}</span>
                      {value}
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export const Statistics: FunctionComponent = () => {
  return (
    <div>
      <h1 className={'pb-5 text-2xl font-bold'}>Statistics</h1>
      <div className={'flex flex-col space-y-8'}>
        <UserStats fullName={'John Doe'} />
        <PortfolioRiskStats />
        <WorkflowStats />
      </div>
    </div>
  );
};
