import { FunctionComponent, useMemo } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

import { ChartContainer } from '@ballerine/ui';
import { titleCase } from 'string-ts';
import { useNavigate } from 'react-router-dom';
import { ctw } from '@/common/utils/ctw/ctw';

type PieChartData = { status?: string; riskLevel?: string; count: number; href?: string };

export type CasePieChartProps = {
  data: PieChartData[];
  getColor: (key: string) => string;
  nameKey: 'status' | 'riskLevel';
  config: Record<string, { label: string; color: string }>;
};

export const CasePieChart: FunctionComponent<CasePieChartProps> = ({
  data,
  getColor,
  nameKey,
  config,
}) => {
  const totalCount = useMemo(() => data.reduce((acc, curr) => acc + curr.count, 0), [data]);

  const navigate = useNavigate();

  return (
    <>
      <ChartContainer className="h-[184px] w-[184px]" config={config}>
        <PieChart width={184} height={184}>
          <text
            x={184 / 2}
            y={184 / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            className={'text-4xl font-bold'}
          >
            {totalCount}
          </text>

          <Pie
            data={data}
            cx={87}
            cy={87}
            innerRadius={60}
            outerRadius={70}
            paddingAngle={7}
            dataKey="count"
            nameKey={nameKey}
            cornerRadius={9999}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getColor(entry[nameKey] as string)}
                className={ctw('outline-none', entry.href && 'cursor-pointer')}
                onClick={() => {
                  if (entry.href) {
                    navigate(entry.href);
                  }
                }}
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
