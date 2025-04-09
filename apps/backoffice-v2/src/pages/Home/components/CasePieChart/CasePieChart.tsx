import { FunctionComponent, useMemo } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

import { ChartContainer } from '@ballerine/ui';
import { titleCase } from 'string-ts';

type PieChartData = { status?: string; riskLevel?: string; count: number };

export const CasePieChart: FunctionComponent<{
  data: PieChartData[];
  getColor: (key: string) => string;
  nameKey: 'status' | 'riskLevel';
  config: Record<string, { label: string; color: string }>;
}> = ({ data, getColor, nameKey, config }) => {
  const totalCount = useMemo(() => data.reduce((acc, curr) => acc + curr.count, 0), [data]);

  return (
    <>
      <ChartContainer className="h-[184px] w-[184px]" config={config}>
        <PieChart width={184} height={184}>
          <text
            x={92}
            y={82}
            textAnchor="middle"
            dominantBaseline="middle"
            className={'text-lg font-bold'}
          >
            {totalCount}
          </text>
          <text x={92} y={102} textAnchor="middle" dominantBaseline="middle">
            Cases
          </text>
          <Pie
            data={data}
            cx={87}
            cy={87}
            innerRadius={78}
            outerRadius={92}
            paddingAngle={5}
            dataKey="count"
            nameKey={nameKey}
            cornerRadius={9999}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getColor(entry[nameKey] as string)}
                className="cursor-pointer outline-none"
              />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <ul className={'flex w-full max-w-sm flex-col space-y-2'}>
        {data.map((entry, index) => {
          const key = entry[nameKey] as string;
          return (
            <li key={index} className={'flex items-center space-x-4 border-b py-1 text-xs'}>
              <span
                className={`flex h-2 w-2 rounded-full`}
                style={{ backgroundColor: getColor(key) }}
              />
              <div className={'flex w-full justify-between'}>
                <span className={'text-slate-500'}>
                  {nameKey === 'riskLevel' ? `${titleCase(key)} Risk` : titleCase(key)}
                </span>
                <span>{entry.count}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};
