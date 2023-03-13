import { useParams } from '@tanstack/react-router';
import { useEndUserQuery } from '../../../../../lib/react-query/queries/useEndUserQuery/useEndUserQuery';
import { createWorkflow } from '@ballerine/workflow-browser-sdk';
import { useWorkflowQuery } from '../../../../../lib/react-query/queries/useWorkflowQuery/useWorkflowQuery';
import { useWorkflowsQuery } from '../../../../../lib/react-query/queries/useWorkflowsQuery/useWorkflowsQuery';

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
    state,
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
    state,
  };
  const faceAUrl = images?.find(({ caption }) => /face/i.test(caption))?.imageUrl;
  const faceBUrl = images?.find(({ caption }) => /id\scardfront/i.test(caption))?.imageUrl;
  const whitelist = ['personalInfo', 'passportInfo', 'checkResults', 'addressInfo'];
  const info = {
    personalInfo,
    passportInfo,
    checkResults,
    addressInfo,
  };
  const { data: workflows } = useWorkflowsQuery({ endUserId });
  const { data: workflow } = useWorkflowQuery({ endUserId, workflowId: workflows?.[0]?.id });
  const workflowService = workflow ? createWorkflow(workflow) : {};

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
