import { useParams } from '@tanstack/react-router';
import { useConsole } from 'hooks/useConsole/useConsole';
import { useEndUserWithWorkflowQuery } from '../../../../../lib/react-query/queries/useEndUserWithWorkflowQuery/useEndUserWithWorkflowQuery';
import { underscoreToSpace } from '../../../../../utils/underscore-to-space/underscore-to-space';

export const useIndividual = () => {
  const { endUserId } = useParams();
  const { data, isLoading } = useEndUserWithWorkflowQuery(endUserId);
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
  const faceAUrl = images?.find(({ caption }) => /face/i.test(caption))?.imageUrl;
  const faceBUrl = images?.find(({ caption }) => /id\scardfront/i.test(caption))?.imageUrl;
  const whitelist = ['workflow', 'personalInfo', 'passportInfo', 'checkResults', 'addressInfo'];
  const info = {
    personalInfo,
    passportInfo,
    checkResults,
    addressInfo,
    workflow: {
      name: underscoreToSpace(data?.workflow?.name),
      state: underscoreToSpace(data?.workflow?.workflowContext?.state),
    },
  };
  useConsole(data?.workflow);

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
