import { Button } from '@/components/atoms';
import { TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { Renderer, TRendererSchema } from '@/components/organisms/Renderer';
import { Check, Trash2Icon, X } from 'lucide-react';
import { FunctionComponent } from 'react';
import { IFormElement } from '../../../../types';
import { StackProvider } from '../../../FieldList/providers/StackProvider';
import { useChildrenDisabledOnLock } from './hooks/useChildrenDisabledOnLock';
import { useEntityLock } from './hooks/useEntityLock';

interface IEntityFieldsProps {
  stack: TDeepthLevelStack;
  fieldId: string;
  index: number;
  element: IFormElement<any, any>;
  elementsOverride: TRendererSchema;
  onRemoveClick: () => void;
}

export const EntityFields: FunctionComponent<IEntityFieldsProps> = ({
  stack,
  fieldId,
  index,
  element,
  elementsOverride,
  onRemoveClick,
}) => {
  const { lockText = 'This entity will be created on submission.' } = element.params || {};

  const { isLocked, lockEntity, unlockEntity } = useEntityLock(element, stack, index);
  const childrens = useChildrenDisabledOnLock(element, isLocked);

  return (
    <div
      key={`${fieldId}-${index}`}
      className="flex flex-col gap-2"
      data-testid={`${fieldId}-fieldlist-item-${index}`}
    >
      <div className="flex flex-row justify-between">
        <Button variant="outline" size="icon" onClick={isLocked ? unlockEntity : lockEntity}>
          {isLocked ? <X /> : <Check className="w-4 h-4 cursor-pointer font-bold" />}
        </Button>
        <Button variant="outline" size="icon" onClick={onRemoveClick}>
          <Trash2Icon
            className="w-4 h-4 cursor-pointer font-bold"
            data-testid={`${fieldId}-fieldlist-item-remove-${index}`}
          />
        </Button>
      </div>
      {isLocked && <p className="text-xs text-green-400">{lockText}</p>}
      <StackProvider stack={[...(stack || []), index]}>
        <Renderer
          elements={childrens || []}
          schema={elementsOverride as unknown as TRendererSchema}
        />
      </StackProvider>
    </div>
  );
};
