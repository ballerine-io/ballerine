import { useList, useNavigation, useOne, useUpdate } from '@pankod/refine-core';
import { IUser } from 'mock-service-worker/users/interfaces';
import routerProvider from '@pankod/refine-react-router-v6';
import { useCallback, useEffect } from 'react';

/**
 * @description Centralizes the mock user data received by Mock Service Worker and consumed by the DetailsGrid.
 */
export const useMockData = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const { id = '' } = routerProvider.useParams() as { id: string };
  const { data: { data } = {} } = useUserQuery(id);

  // Personal info
  const {
    first_name: firstName = '',
    middle_name: middleName = '',
    last_name: lastName = '',
    phone = '',
    email = '',
    date_of_birth: dateOfBirth = '',
    place_of_birth: placeOfBirth = '',
    sex = '',
  } = data ?? {};
  const personalDetails = {
    firstName,
    middleName,
    lastName,
    phone,
    email,
    dateOfBirth,
    placeOfBirth,
    sex,
  };

  // Passport
  const { type, authority, place_of_issue: placeOfIssue, date_of_issue: dateOfIssue, expires } = data?.passport ?? {};
  const passportDetails = {
    type,
    authority,
    placeOfIssue,
    dateOfIssue,
    expires,
  };

  // Check results
  const {
    final_result: finalResult,
    scanned_by: scannedBy,
    aml_check: amlCheck,
    id_check: idCheck,
    selfie_check: selfieCheck,
  } = data?.check_results ?? {};
  const checkResults = {
    finalResult,
    scannedBy,
    amlCheck,
    idCheck,
    selfieCheck,
  };

  // Images
  const images =
    data?.documents?.map(({ url, doctype: docType }) => ({
      url,
      docType,
    })) ?? [];

  return {
    passportDetails,
    checkResults,
    personalDetails,
    images,
  };
};

export const useSelectedUserQuery = () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const { id = '' } = routerProvider.useParams() as { id: string };
  const { data, ...query } = useList<IUser>({
    resource: 'users',
    id,
    queryOptions: {
      enabled: !!id,
      // @ts-ignore
      select: ({ data }) => {
        const selectedUser = data?.find(user => user.id === id);
        const { first_name = '', last_name = '' } = selectedUser ?? {};

        return {
          data: {
            id,
            fullName: `${first_name} ${last_name}`,
          },
        };
      },
    },
  });

  return {
    data: data as unknown as {
      data: {
        id: string;
        fullName: string;
      };
    },
    ...query,
  };
};

export const useUsersQuery = () =>
  useList<IUser>({
    resource: 'users',
  });

export const useUserQuery = (id: string) =>
  useOne<IUser>({
    resource: 'users',
    id,
    queryOptions: {
      enabled: !!id,
    },
  });

/**
 * @description Sets the selected user to the first user in the array on mount if no user is currently selected. Returns the select user handler.
 */
export const useHandleSelectedUser = (data?: Array<IUser>) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const { id = '' } = routerProvider.useParams() as { id: string };
  const firstUserId = data?.[0]?.id;
  const { show } = useNavigation();
  const selectUser = useCallback(
    (id: string) => () => {
      if (!id) return;

      show('users', id);
    },
    [show],
  );

  useEffect(() => {
    if (!firstUserId || !data || (id && data.some(user => user.id === id))) return;

    selectUser(firstUserId)();
  }, [show, id, firstUserId]);

  return {
    selectUser,
  };
};

export const useRejectUserMutation = () => useUpdate<IUser>();
export const useApproveUserMutation = () => useUpdate<IUser>();
