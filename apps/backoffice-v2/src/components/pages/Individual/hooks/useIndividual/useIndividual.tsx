import { useParams } from '@tanstack/react-router';
import { useEndUserQuery } from '../../../../../lib/react-query/queries/useEndUserQuery/useEndUserQuery';

export const useIndividual = () => {
  const { endUserId } = useParams();
  const { data, isLoading } = useEndUserQuery(endUserId);
  const {
    firstName,
    middleName,
    lastName,
    fullName,
    phone,
    email,
    dateOfBirth,
    placeOfBirth,
    sex,
    avatarUrl,
    passport: passportInfo,
    address: addressInfo,
    checkResults,
  } = data ?? {};
  const personalInfo = {
    firstName,
    middleName,
    lastName,
    phone,
    email,
    dateOfBirth,
    placeOfBirth,
    sex,
  };

  // Images
  const images =
    data?.documents?.map(({ url: imageUrl, doctype: caption }) => ({
      imageUrl,
      caption: caption.replace(/_/g, ' ').replace('id', 'ID'),
    })) ?? [];

  const selectedEndUser = {
    id: endUserId,
    fullName,
    avatarUrl,
  };
  const faceAUrl = images?.find(({ caption }) =>
    /selfie/i.test(caption),
  )?.imageUrl;
  const faceBUrl = images?.find(({ caption }) =>
    /id\sdocument\s\(face\)/i.test(caption),
  )?.imageUrl;
  const whitelist = [
    'personalInfo',
    'passportInfo',
    'checkResults',
    'addressInfo',
  ];
  const info = {
    personalInfo,
    passportInfo,
    checkResults,
    addressInfo,
  };

  return {
    selectedEndUser,
    faceAUrl,
    faceBUrl,
    info,
    images,
    isLoading,
    whitelist,
  };
};
