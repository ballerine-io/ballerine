import { UiDefinitionModel } from '@/ui-definition/ui-definition.model';
import { Type } from 'class-transformer';

export class UpdateUiDefinitionDto {
  @Type(() => UiDefinitionModel)
  uiDefinition!: UiDefinitionModel;
}
