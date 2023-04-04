import { useParams } from "@tanstack/react-router";
import { camelCaseToSpace } from "../../../../../utils/camel-case-to-space/camel-case-to-space";
import {
  useEndUserWithWorkflowQuery
} from "../../../../../lib/react-query/queries/useEndUserWithWorkflowQuery/useEndUserWithWorkflowQuery";
import {
  useStorageFileQuery
} from "../../../../../lib/react-query/queries/useStorageFileQuery/useStorageFileQuery";
import { underscoreToSpace } from "../../../../../utils/underscore-to-space/underscore-to-space";

export const useIndividual = () => {
  const { endUserId } = useParams();
  const { data, isLoading } = useEndUserWithWorkflowQuery(endUserId);
  const documentOne = data?.workflow?.workflowContext?.machineContext?.documentOne;
  const documentTwo = data?.workflow?.workflowContext?.machineContext?.documentTwo;
  const { data: data1 } = useStorageFileQuery(documentOne?.id);
  const { data: data2 } = useStorageFileQuery(documentTwo?.id);
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
  const documents = [
    {
      url: data1,
      doctype: documentOne?.type,
    },
    {
      url: data2,
      doctype: documentTwo?.type + 'Confirmation',
    },
  ].filter(({ url }) => !!url);

  // Images
  const images =
    documents?.map(({ url: imageUrl, doctype: caption }) => ({
      imageUrl,
      caption: camelCaseToSpace(caption)?.replace('id', 'ID'),
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
    checkResults: { ...checkResults, finalResult: data?.state },
    addressInfo,
    workflow: {
      name: underscoreToSpace(data?.workflow?.name),
      state: underscoreToSpace(data?.workflow?.workflowContext?.state),
    },
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
