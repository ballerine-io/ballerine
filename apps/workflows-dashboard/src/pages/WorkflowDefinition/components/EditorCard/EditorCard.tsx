import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardHeader } from '@/components/atoms/Card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/atoms/Dialog';
import { JSONEditorComponent } from '@/components/organisms/JsonEditor';
import { Pencil } from 'lucide-react';
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';

interface IEditorCardProps {
  value: object;
  title: string;
  dialogContent?: React.ReactNode | React.ReactNode[];
  onChange?: (value: object) => void;
  onSave?: (value: object) => void;
  onOpenChange?: (open: boolean) => void;
  onUpgrade?: () => void;
}

export const EditorCard: FunctionComponent<IEditorCardProps> = ({
  value,
  title,
  dialogContent,
  onChange,
  onSave,
  onOpenChange,
  onUpgrade,
}) => {
  const [valueSnapshot, setSnapshot] = useState(value);
  const [internalValue, setInternalValue] = useState(valueSnapshot);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const hasChanges = useMemo(() => {
    return JSON.stringify(internalValue) !== JSON.stringify(valueSnapshot);
  }, [internalValue, valueSnapshot]);

  const handleChange = useCallback(
    (value: object) => {
      setInternalValue(value);
      onChange && onChange(value);
    },
    [onChange],
  );

  const handleSave = useCallback(() => {
    setSnapshot(internalValue);
    onSave && onSave(internalValue);
  }, [internalValue, onSave]);

  return (
    <Dialog
      onOpenChange={open => {
        if (!open) {
          setSnapshot(value);
          setInternalValue(value);
        }
        onOpenChange && onOpenChange(open);
      }}
    >
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
          <JSONEditorComponent readOnly value={value} />
        </CardContent>
      </Card>
      {dialogContent ? (
        dialogContent
      ) : (
        <DialogContent className="h-[80vh] min-w-[80vw] overflow-hidden pt-12">
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <JSONEditorComponent value={internalValue} onChange={handleChange} />
            </div>
            {onSave && (
              <div className="flex justify-end gap-2">
                <Button onClick={onUpgrade}>Upgrade</Button>
                <Button disabled={!hasChanges} onClick={handleSave}>
                  Update
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};
