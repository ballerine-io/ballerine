import { Link, Typography, tw } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

export interface ICompanySanctionsMatchSectionAddress {
  addresses: string[];
  city: string;
  country: string;
}

interface ICompanySanctionsMatchSectionProps {
  primaryName: string;
  matchNumber: number;
  lastReviewedDate: string;
  labels: string[];
  matchReasons: string[];
  sources: string[];
  addresses: ICompanySanctionsMatchSectionAddress[];
}

export const CompanySanctionsMatchSection: FunctionComponent<
  ICompanySanctionsMatchSectionProps
> = ({ primaryName, matchNumber, lastReviewedDate, labels, matchReasons, sources, addresses }) => {
  return (
    <View style={tw('flex flex-col')}>
      <Typography styles={[tw('text-[10px] leading-[2.25rem]')]} weight="bold">
        Match {matchNumber}
      </Typography>
      <View style={tw('flex flex-col gap-4')}>
        <View style={tw('flex flex-col gap-1')}>
          <View style={tw('flex flex-row')}>
            <View style={tw('w-[120px]')}>
              <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
                Primary Name
              </Typography>
            </View>
            <View style={tw('w-[400px]')}>
              <Typography styles={[tw('text-[8px] leading-[1.45rem]')]}>{primaryName}</Typography>
            </View>
          </View>
          <View style={tw('flex flex-row')}>
            <View style={tw('w-[120px]')}>
              <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
                Last Reviewed
              </Typography>
            </View>
            <View style={tw('w-[400px]')}>
              <Typography styles={[tw('text-[8px] leading-[1.45rem]')]}>
                {lastReviewedDate}
              </Typography>
            </View>
          </View>
          <View style={tw('flex flex-row')}>
            <View style={tw('w-[120px]')}>
              <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
                Labels
              </Typography>
            </View>
            <View style={tw('w-[400px]')}>
              <Typography styles={[tw('text-[8px] leading-[1.45rem]')]}>
                {labels?.join(' - ')}
              </Typography>
            </View>
          </View>
          <View style={tw('flex flex-row')}>
            <View style={tw('w-[120px]')}>
              <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
                Reasons for Match
              </Typography>
            </View>
            <View style={tw('w-[400px]')}>
              <Typography styles={[tw('text-[8px] leading-[1.45rem]')]}>
                {matchReasons?.join(' - ')}
              </Typography>
            </View>
          </View>
          <View style={tw('flex flex-row')}>
            <View style={tw('w-[120px]')}>
              <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
                Sources
              </Typography>
            </View>
            <View style={tw('w-[400px] flex flex-row gap-2 flex-wrap')}>
              {sources.map(url => (
                <Link key={url} href={url} styles={[tw('text-[#007AFF] no-underline')]} />
              ))}
            </View>
          </View>
        </View>
        <View style={tw('flex flex-col gap-2')}>
          <View style={tw('flex flex-row gap-4')}>
            {/* Table Header --- start */}
            <View style={tw('flex flex-row')}>
              <View style={tw('flex w-[50%]')}>
                <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
                  Addresses
                </Typography>
              </View>
              <View style={tw('flex w-[15%]')}>
                <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
                  City
                </Typography>
              </View>
              <View style={tw('flex w-[35%]')}>
                <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
                  Country
                </Typography>
              </View>
            </View>
            {/* Table Header --- end */}
          </View>
          {/* Table Body --- start */}
          {addresses.map((item, index) => (
            <View key={index} style={tw('flex flex-row')}>
              <View style={tw('flex w-[50%] text-ellipsis')}>
                <View style={tw('mr-4 overflow-hidden')}>
                  <Typography styles={[tw('text-[8px]')]}>{item.addresses.join(' , ')}</Typography>
                </View>
              </View>
              <View style={tw('flex w-[15%]')}>
                <Typography styles={[tw('text-[8px]')]}>{item.city}</Typography>
              </View>
              <View style={tw('flex w-[35%]')}>
                <Typography styles={[tw('text-[8px]')]}>{item.country}</Typography>
              </View>
            </View>
          ))}
          {/* Table Body --- end */}
        </View>
      </View>
    </View>
  );
};
