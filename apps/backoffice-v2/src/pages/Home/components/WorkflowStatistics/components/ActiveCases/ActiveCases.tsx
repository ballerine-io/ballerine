import React, { FunctionComponent } from 'react';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { Cell, Pie, PieChart } from 'recharts';
import { ctw } from '@/common/utils/ctw/ctw';

export const ActiveCases: FunctionComponent<{
  assignedTags: number;
  tags: Array<{ id: string; name: string; value: number }>;
  tagsWithColor: Array<{ id: string; name: string; value: number; color: string }>;
  visibleActiveCases: Array<{ name: string; color: string; value: number }>;
  visibleActiveCasesAmount: number;
}> = ({ assignedTags, tags, tagsWithColor, visibleActiveCases, visibleActiveCasesAmount }) => {
  return (
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
                {tagsWithColor?.map(filter => {
                  return (
                    <Cell
                      className={'outline-none'}
                      key={filter.id}
                      style={{
                        fill: filter.color,
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
                        backgroundColor: color,
                      }}
                    />
                    <div className={'flex w-full justify-between'}>
                      <span className={'text-slate-500'}>{name}</span>
                      {value}
                    </div>
                  </li>
                );
              })}
              {tags?.length > visibleActiveCasesAmount && (
                <li className={'ms-6 text-xs'}>{tags?.length - visibleActiveCasesAmount} More</li>
              )}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
