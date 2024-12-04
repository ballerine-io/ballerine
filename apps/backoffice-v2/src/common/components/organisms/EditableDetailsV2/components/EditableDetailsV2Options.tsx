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
  onEnableIsEditable: () => void;
}> = ({ onEnableIsEditable }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={'px-2 py-0 text-xs'}>
          Options
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className={`h-6 w-full`} asChild>
          <Button
            variant={'ghost'}
            className="justify-start text-xs leading-tight"
            onClick={onEnableIsEditable}
          >
            <Edit size={16} className="me-2" /> Edit
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
