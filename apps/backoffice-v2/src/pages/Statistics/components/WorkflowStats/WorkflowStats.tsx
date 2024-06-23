import React, { ComponentProps, FunctionComponent, useMemo } from 'react';
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
import { titleCase } from 'string-ts';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { ctw } from '@/common/utils/ctw/ctw';
import { Show } from '@/common/components/atoms/Show/Show';

import { assignColorToItem } from '@/common/utils/assign-color-to-item/assign-color-to-item';

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
      assignColorToItem({
        items: tags,
        baseLightnessOffset: 32,
        duplicateLightnessOffsetStep: 8,
        baseRgbColor: { red: 0, green: 122, blue: 255 },
      })
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
      assignColorToItem({
        items: filtersPendingManualReview,
        baseLightnessOffset: 32,
        duplicateLightnessOffsetStep: 8,
        baseRgbColor: { red: 0, green: 122, blue: 255 },
      })
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
