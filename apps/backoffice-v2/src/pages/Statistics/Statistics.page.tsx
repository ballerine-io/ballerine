import React, { FunctionComponent, ReactNode, useMemo } from 'react';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { Show } from '@/common/components/atoms/Show/Show';
import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';
import { CardFooter } from '@/common/components/atoms/Card/Card.Footer';
import { Cell, Pie, PieChart } from 'recharts';
import { ctw } from '@/common/utils/ctw/ctw';

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
  },
  {
    id: 'ckl1y5e0x0002wxrmnd8j9rb7',
    name: 'Tier 2 Account',
    value: 4,
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
  const baseLightnessOffset = 16; // Base lightness offset for all items
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
          <div key={title} className={'rounded-xl bg-[#F6F6F6] p-2'}>
            <Card className={'flex h-[10.125rem] flex-col px-3'}>
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
export const PortfolioRiskStats: FunctionComponent = () => {};
export const WorkflowStats: FunctionComponent = () => {};

export const Statistics: FunctionComponent = () => {
  return (
    <div>
      <h1 className={'pb-5 text-2xl font-bold'}>Statistics</h1>
      <UserStats fullName={'John Doe'} />
    </div>
  );
};
