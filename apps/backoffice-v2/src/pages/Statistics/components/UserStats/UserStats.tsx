import React, { FunctionComponent, ReactNode, useMemo } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import { ctw } from '@/common/utils/ctw/ctw';
import { Show } from '@/common/components/atoms/Show/Show';
import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { CardFooter } from '@/common/components/atoms/Card/Card.Footer';

import { assignColorToItem } from '@/common/utils/assign-color-to-item/assign-color-to-item';

export const UserStats: FunctionComponent<{
  fullName: string;
}> = ({ fullName }) => {
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
  const filtersWithColors = useMemo(
    () =>
      assignColorToItem({
        items: filters,
        baseLightnessOffset: 32,
        duplicateLightnessOffsetStep: 8,
        baseRgbColor: { red: 0, green: 122, blue: 255 },
      })
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
