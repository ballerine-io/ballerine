import React, { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { Cell, Pie, PieChart } from 'recharts';
import { ctw } from '@/common/utils/ctw/ctw';
import { Button } from '@/common/components/atoms/Button/Button';
import { TrendingDown, TrendingUp } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/common/components/atoms/Table';
import { titleCase } from 'string-ts';

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
