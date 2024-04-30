import { ValueOrNone } from '@/pages/Entity/pdfs/case-information/pages/IndividualSanctionsPage/components/IndividualSanctionsItem/ValueOrNone';
import { TIndividualSanctionsItemData } from '@/pages/Entity/pdfs/case-information/pages/IndividualSanctionsPage/individual-sanctions.schema';
import { Link, Typography, tw } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

interface IIndividualSanctionsItemProps {
  item: TIndividualSanctionsItemData;
}

export const IndividualSanctionsItem: FunctionComponent<IIndividualSanctionsItemProps> = ({
  item,
}) => {
  const { checkDate, matchesCount, names, warnings, sanctions, PEP, adverseMedia, fullName } = item;

  return (
    <View style={tw('flex flex-col')}>
      <View>
        <Typography styles={[tw('text-[10px] leading-[2.5rem]')]} weight="bold">
          {fullName}
        </Typography>
      </View>
      <View style={tw('flex flex-col gap-1')}>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              Checked at
            </Typography>
          </View>
          <View style={tw('w-[400px]')}>
            <ValueOrNone value={checkDate ? new Date(checkDate).toISOString() : undefined} />
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
              {`${matchesCount} Match${matchesCount === 1 ? '' : 'es'}`}
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
          <View style={tw('w-[400px] flex flex-row flex-wrap gap-2')}>
            {warnings.length ? (
              warnings.map((warning, index) => (
                <Link
                  key={index}
                  href={warning.sourceUrl}
                  url={warning.name}
                  styles={[tw('text-[#007AFF] no-underline')]}
                />
              ))
            ) : (
              <ValueOrNone value={undefined} />
            )}
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              Sanctions
            </Typography>
          </View>
          <View style={tw('w-[400px] flex flex-row gap-2 flex-wrap')}>
            {sanctions.length ? (
              sanctions.map((sanction, index) => (
                <Link
                  key={index}
                  href={sanction.sourceUrl}
                  url={sanction.name}
                  styles={[tw('text-[#007AFF] no-underline')]}
                />
              ))
            ) : (
              <ValueOrNone value={undefined} />
            )}
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              PEP
            </Typography>
          </View>
          <View style={tw('w-[400px] flex flex-row gap-2 flex-wrap')}>
            {PEP.length ? (
              PEP.map((PEP, index) => (
                <Link
                  key={index}
                  href={PEP.sourceUrl}
                  url={PEP.name}
                  styles={[tw('text-[#007AFF] no-underline')]}
                />
              ))
            ) : (
              <ValueOrNone value={undefined} />
            )}
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              Adverse Media
            </Typography>
          </View>
          <View style={tw('w-[400px] flex flex-row gap-2 flex-wrap')}>
            {adverseMedia.length ? (
              adverseMedia.map((adverseMedia, index) => (
                <Link
                  key={index}
                  href={adverseMedia.sourceUrl}
                  url={adverseMedia.name}
                  styles={[tw('text-[#007AFF] no-underline')]}
                />
              ))
            ) : (
              <ValueOrNone value={undefined} />
            )}
          </View>
        </View>
      </View>
    </View>
  );
};
