import { HoverCard, HoverCardContent, HoverCardTrigger } from '@ballerine/ui';
import { InfoIcon } from 'lucide-react';

import { FunctionComponent } from 'react';
import { toTitleCase } from 'string-ts';

interface IRegistryOriginValueTitle {
  title: string;
  originalValue: string;
}

export const RegistryOriginValueTitle: FunctionComponent<IRegistryOriginValueTitle> = ({
  title,
  originalValue,
}) => {
  return (
    <div className="group relative flex items-center gap-2 rounded-md">
      <HoverCard openDelay={0} open={originalValue ? undefined : false}>
        <HoverCardTrigger asChild>
          <div className="flex cursor-help items-center gap-2">
            <span className="font-medium text-gray-700">{toTitleCase(title)}</span>
            {originalValue && <InfoIcon className="h-4 w-4 text-gray-500" />}
          </div>
        </HoverCardTrigger>
        <HoverCardContent side="top" align="center" className="w-80">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              The value in parentheses is the original value from the registry, while the value
              below is normalized for consistency
            </p>
            <p className="text-sm font-medium text-gray-500">Original value: {originalValue}</p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};
