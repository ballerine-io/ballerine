import { ValueOrNone } from '@/pages/Entity/pdfs/case-information/pages/IndividualSanctionsPage/components/IndividualSanctionsItem/ValueOrNone';
import { Typography, tw } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

export interface IIndividualSanctionsItem {
  checkedAt: string;
  matchesCount: number;
  names: string[];
  warnings: string[];
  sanctions: string[];
  PEP: string[];
  adverseMedia: string[];
  firstName: string;
  lastName: string;
}

interface IIndividualSanctionsItemProps {
  item: IIndividualSanctionsItem;
}

export const IndividualSanctionsItem: FunctionComponent<IIndividualSanctionsItemProps> = ({
  item,
}) => {
  const {
    checkedAt,
    matchesCount,
    names,
    warnings,
    sanctions,
    PEP,
    adverseMedia,
    firstName,
    lastName,
  } = item;

  return (
    <View style={tw('flex flex-col')}>
      <View>
        <Typography
          styles={[tw('text-[10px] leading-[2.5rem]')]}
          weight="bold"
        >{`${firstName} ${lastName}`}</Typography>
      </View>
      <View style={tw('flex flex-col gap-1')}>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              Checked at
            </Typography>
          </View>
          <View style={tw('w-[400px]')}>
            <ValueOrNone value={checkedAt} />
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              Result
            </Typography>
          </View>
          <View style={tw('w-[400px]')}>
            <Typography
              styles={[
                tw(
                  `text-[8px] leading-[1.45rem] text-[${
                    matchesCount === 0 ? '#00BD59' : '#DF2222'
                  }]`,
                ),
              ]}
              weight="bold"
            >
              {`${matchesCount} Matche${matchesCount === 1 ? '' : 's'}`}
            </Typography>
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              Names
            </Typography>
          </View>
          <View style={tw('w-[400px]')}>
            <ValueOrNone value={names?.join(', ')} />
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              Warnings
            </Typography>
          </View>
          <View style={tw('w-[400px]')}>
            <ValueOrNone value={warnings?.join(' ')} />
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              Sanctions
            </Typography>
          </View>
          <View style={tw('w-[400px] flex flex-row gap-2 flex-wrap')}>
            <ValueOrNone value={sanctions.join(', ')} />
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              PEP
            </Typography>
          </View>
          <View style={tw('w-[400px] flex flex-row gap-2 flex-wrap')}>
            <ValueOrNone value={PEP?.join(', ')} />
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              Adverse Media
            </Typography>
          </View>
          <View style={tw('w-[400px] flex flex-row gap-2 flex-wrap')}>
            <ValueOrNone value={adverseMedia?.join(', ')} />
          </View>
        </View>
      </View>
    </View>
  );
};
