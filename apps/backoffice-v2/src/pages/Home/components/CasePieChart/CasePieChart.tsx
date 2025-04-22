import { FunctionComponent, useMemo } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

import { ctw } from '@/common/utils/ctw/ctw';
import { ChartContainer } from '@ballerine/ui';
import { useNavigate } from 'react-router-dom';

type PieChartData = { status?: string; riskLevel?: string; count: number; href?: string };

export type CasePieChartProps = {
  data: PieChartData[];
  getDefinition: (key: string) => { color: string; text: string };
  nameKey: 'status' | 'riskLevel';
  config: Record<string, { label: string; color: string }>;
};

export const CasePieChart: FunctionComponent<CasePieChartProps> = ({
  data,
  getDefinition,
  nameKey,
  config,
}) => {
  const totalCount = useMemo(() => data.reduce((acc, curr) => acc + curr.count, 0), [data]);

  const navigate = useNavigate();

  if (data.length === 0) {
    return (
      <div className={'flex h-[184px] w-[184px] items-center justify-center text-slate-500'}>
        No Data Available
      </div>
    );
  }

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
                fill={getDefinition(entry[nameKey] as string).color}
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
                style={{ backgroundColor: getDefinition(key).color }}
              />
              <div className={'flex w-full justify-between'}>
                <span className={'text-slate-500'}>{getDefinition(key).text}</span>
                <span>{entry.count}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};
