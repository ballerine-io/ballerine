import { TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { Renderer, TRendererSchema } from '@/components/organisms/Renderer';
import { FunctionComponent } from 'react';
import { IFormElement } from '../../../../types';
import { StackProvider } from '../../../FieldList/providers/StackProvider';
import { IEntityFieldGroupParams } from '../../EntityFieldGroup';

interface IEntityFieldsProps {
  stack: TDeepthLevelStack;
  fieldId: string;
  entityId: string;
  element: IFormElement<any, IEntityFieldGroupParams>;
  elementsOverride: TRendererSchema;
  index: number;
}

export const EntityFields: FunctionComponent<IEntityFieldsProps> = ({
  stack,
  fieldId,
  entityId,
  element,
  elementsOverride,
  index,
}) => {
  return (
    <div
      key={`${fieldId}-${entityId}`}
      className="flex flex-col gap-2"
      data-testid={`${fieldId}-fieldlist-item-${entityId}`}
    >
      <StackProvider stack={[...(stack || []), index]}>
        <Renderer
          elements={element.children || []}
          schema={elementsOverride as unknown as TRendererSchema}
        />
      </StackProvider>
    </div>
  );
};
