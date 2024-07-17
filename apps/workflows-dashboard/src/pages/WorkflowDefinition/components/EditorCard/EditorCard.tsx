import { Card, CardContent, CardHeader } from '@/components/atoms/Card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/atoms/Dialog';
import { JSONEditorComponent } from '@/components/organisms/JsonEditor';
import { Pencil } from 'lucide-react';
import { FunctionComponent } from 'react';

interface IEditorCardProps {
  value: object;
  title: string;
  onChange: (value: object) => void;
}

export const EditorCard: FunctionComponent<IEditorCardProps> = ({ value, title, onChange }) => {
  return (
    <Dialog>
      <Card className="flex h-[400px] h-full flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <span>{title}</span>
          <span>
            <DialogTrigger asChild>
              <Pencil />
            </DialogTrigger>
          </span>
        </CardHeader>
        <CardContent className="flex-1">
          <JSONEditorComponent readOnly value={value} onChange={onChange} />
        </CardContent>
      </Card>
      <DialogContent className="h-[80vh] min-w-[80vw] overflow-hidden pt-12">
        <JSONEditorComponent value={value} onChange={onChange} />
      </DialogContent>
    </Dialog>
  );
};
