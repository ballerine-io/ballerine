import { TIdentityVerificationsItemData } from '@/pages/Entity/pdfs/case-information/pages/IdentityVerificationsPage/identity-verifications.schema';
import { ValueOrNone } from '@/pages/Entity/pdfs/case-information/pages/IndividualSanctionsPage/components/IndividualSanctionsItem/ValueOrNone';
import { tw, Typography } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

export const IdentityItem: FunctionComponent<TIdentityVerificationsItemData> = ({
  checkDate,
  reason,
  status,
  firstName,
  lastName,
  dateOfBirth,
  id,
  gender,
  nationality,
}) => {
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
            {status === 'approved' && (
              <Typography
                styles={[tw('text-[8px] leading-[1.45rem] text-[#00BD59]')]}
                weight="bold"
              >
                Approved
              </Typography>
            )}
            {status === 'rejected' && (
              <Typography
                styles={[tw('text-[8px] leading-[1.45rem] text-[#DF2222]')]}
                weight="bold"
              >
                Rejected
              </Typography>
            )}
            {!status && <ValueOrNone value={status} />}
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              Reason
            </Typography>
          </View>
          <View style={tw('w-[400px]')}>
            <ValueOrNone value={reason} />
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              First Name
            </Typography>
          </View>
          <View style={tw('w-[400px]')}>
            <ValueOrNone value={firstName} />
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              Last Name
            </Typography>
          </View>
          <View style={tw('w-[400px] flex flex-row gap-2 flex-wrap')}>
            <ValueOrNone value={lastName} />
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              Date of Birth
            </Typography>
          </View>
          <View style={tw('w-[400px] flex flex-row gap-2 flex-wrap')}>
            <ValueOrNone value={dateOfBirth ? new Date(dateOfBirth).toISOString() : undefined} />
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              ID Number
            </Typography>
          </View>
          <View style={tw('w-[400px] flex flex-row gap-2 flex-wrap')}>
            <ValueOrNone value={id} />
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              Gender
            </Typography>
          </View>
          <View style={tw('w-[400px] flex flex-row gap-2 flex-wrap')}>
            <ValueOrNone value={gender} />
          </View>
        </View>
        <View style={tw('flex flex-row')}>
          <View style={tw('w-[80px]')}>
            <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
              Nationality
            </Typography>
          </View>
          <View style={tw('w-[400px] flex flex-row gap-2 flex-wrap')}>
            <ValueOrNone value={nationality} />
          </View>
        </View>
      </View>
    </View>
  );
};
