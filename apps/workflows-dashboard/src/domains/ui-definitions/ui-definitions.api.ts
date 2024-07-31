import {
  CopyUIDefinitionDto,
  GetUIDefinitionByIdDto,
  IUIDefinition,
  UpdateUIDefinitionDto,
} from '@/domains/ui-definitions/ui-definitions.types';
import { request } from '@/lib/request';

export const fetchUIDefinitions = async () => {
  const result = await request.get<IUIDefinition[]>('/external/ui-definition');

  return result.data;
};

export const updateUIDefinition = async (dto: UpdateUIDefinitionDto) => {
  const result = await request.put(`/external/ui-definition/${dto.uiDefinitionId}`, {
    uiDefinition: dto.uiDefinition,
  });

  return result.data;
};

export const copyUIDefinition = async (dto: CopyUIDefinitionDto) => {
  const result = await request.post(`/ui-definition/${dto.uiDefinitionId}/copy`);
};

export const fetchUIDefinition = async (dto: GetUIDefinitionByIdDto) => {
  const result = await request.get<IUIDefinition>(`/internal/ui-definition/${dto.uiDefinitionId}`);

  return result.data;
};
