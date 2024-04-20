import { Typography, tw } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

export interface IIdentityItem {
  checkedAt: string;
  result: 'approved' | 'rejected';
  reason: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  id: string;
  gender: string;
  nationality: string;
}

interface IIdentityItemProps {
  item: IIdentityItem;
}

export const IdentityItem: FunctionComponent<IIdentityItemProps> = ({ item }) => {
  const { checkedAt, reason, result, firstName, lastName, dateOfBirth, id, gender, nationality } =
    item;

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
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]}>{checkedAt}</Typography>
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              Result
            </Typography>
          </View>
          <View style={tw('w-[400px]')}>
            {result === 'approved' && (
              <Typography
                styles={[tw('text-[8px] leading-[1.45rem] text-[#00BD59]')]}
                weight="bold"
              >
                Approved
              </Typography>
            )}
            {result === 'rejected' && (
              <Typography
                styles={[tw('text-[8px] leading-[1.45rem] text-[#DF2222]')]}
                weight="bold"
              >
                Rejected
              </Typography>
            )}
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              Reason
            </Typography>
          </View>
          <View style={tw('w-[400px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]}>{reason}</Typography>
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              First Name
            </Typography>
          </View>
          <View style={tw('w-[400px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]}>{firstName}</Typography>
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              Last Name
            </Typography>
          </View>
          <View style={tw('w-[400px] flex flex-row gap-2 flex-wrap')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]}>{lastName}</Typography>
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              Date of Birth
            </Typography>
          </View>
          <View style={tw('w-[400px] flex flex-row gap-2 flex-wrap')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]}>{dateOfBirth}</Typography>
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              ID Number
            </Typography>
          </View>
          <View style={tw('w-[400px] flex flex-row gap-2 flex-wrap')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]}>{id}</Typography>
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              Gender
            </Typography>
          </View>
          <View style={tw('w-[400px] flex flex-row gap-2 flex-wrap')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]}>{gender}</Typography>
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              Nationality
            </Typography>
          </View>
          <View style={tw('w-[400px] flex flex-row gap-2 flex-wrap')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]}>{nationality}</Typography>
          </View>
        </View>
      </View>
    </View>
  );
};
