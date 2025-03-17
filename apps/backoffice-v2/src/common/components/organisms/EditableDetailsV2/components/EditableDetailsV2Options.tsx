import {
  DropdownMenuContent,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@ballerine/ui';
import { Edit } from 'lucide-react';
import { FunctionComponent } from 'react';

export const EditableDetailsV2Options: FunctionComponent<{
  actions: {
    options: {
      disabled: boolean;
    };
    enableEditing: {
      disabled: boolean;
    };
  };
  onEnableIsEditable: () => void;
}> = ({ actions, onEnableIsEditable }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={'px-2 py-0 text-xs aria-disabled:pointer-events-none aria-disabled:opacity-50'}
          aria-disabled={actions.options.disabled}
        >
          Options
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className={`h-6 w-full`} asChild>
          <Button
            variant={'ghost'}
            className="justify-start text-xs leading-tight aria-disabled:pointer-events-none aria-disabled:opacity-50"
            aria-disabled={actions.enableEditing.disabled}
            onClick={onEnableIsEditable}
          >
            <Edit size={16} className="me-2" /> Edit
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
