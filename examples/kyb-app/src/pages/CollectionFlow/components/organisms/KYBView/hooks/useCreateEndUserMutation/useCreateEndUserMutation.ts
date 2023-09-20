import { createEndUser } from '@app/domains/end-user';
import { CreateEndUserDto, CreateEndUserResponse } from '@app/domains/end-user/types';
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useCreateEndUserMutation = (onSuccess?: () => void) => {
  const { mutateAsync } = useMutation({
    mutationFn: createEndUser,
    onSuccess,
  }) as UseMutationResult<CreateEndUserResponse, Error, CreateEndUserDto>;

  const createUserAsync = useCallback(
    async (dto: CreateEndUserDto) => {
      return await mutateAsync(dto);
    },
    [mutateAsync],
  );

  return {
    createUserAsync,
  };
};
