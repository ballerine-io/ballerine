import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardHeader } from '@/components/atoms/Card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/atoms/Dialog';
import { JSONEditorComponent } from '@/components/organisms/JsonEditor';
import { Code, Eye, Pencil } from 'lucide-react';
import { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';

interface IEditorCardProps {
  value: object;
  title: string;
  dialogContent?: React.ReactNode | React.ReactNode[];
  viewDialogContent?: React.ReactNode;
  rawEditDialogContent?: React.ReactNode;
  noCodeDialogContent?: React.ReactNode;
  onChange?: (value: object) => void;
  onSave?: (value: object) => void;
  onOpenChange?: (open: boolean) => void;
  onUpgrade?: () => void;
}

export const EditorCard: FunctionComponent<
  IEditorCardProps & {
    enableViewMode?: boolean;
    enableNoCodeMode?: boolean;
  }
> = ({
  value,
  title,
  dialogContent,
  viewDialogContent,
  rawEditDialogContent,
  noCodeDialogContent,
  onChange,
  onSave,
  onOpenChange,
  onUpgrade,
  enableViewMode = false,
  enableNoCodeMode = false,
}) => {
  const [valueSnapshot, setSnapshot] = useState(value);
  const [internalValue, setInternalValue] = useState(valueSnapshot);
  const [dialogMode, setDialogMode] = useState<'view' | 'raw-edit' | 'no-code' | undefined>(
    undefined,
  );

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const hasChanges = useMemo(() => {
    return JSON.stringify(internalValue) !== JSON.stringify(valueSnapshot);
  }, [internalValue, valueSnapshot]);

  const handleChange = useCallback(
    (value: object) => {
      setInternalValue(value);
      onChange?.(value);
    },
    [onChange],
  );

  const handleSave = useCallback(() => {
    setSnapshot(internalValue);
    onSave?.(internalValue);
  }, [internalValue, onSave]);

  const renderDialogContent = () => {
    if (dialogContent) return dialogContent;

    switch (dialogMode) {
      case 'view':
        return (
          <DialogContent className="h-[85vh] min-w-[85vw] overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
            {viewDialogContent ? (
              viewDialogContent
            ) : (
              <div className="flex h-full flex-col gap-6">
                <div className="flex-1 rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <JSONEditorComponent readOnly value={value} />
                </div>
              </div>
            )}
          </DialogContent>
        );

      case 'raw-edit':
        return (
          <DialogContent className="h-[85vh] min-w-[85vw] overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
            {rawEditDialogContent ? (
              rawEditDialogContent
            ) : (
              <div className="flex h-full flex-col gap-6">
                <div className="flex-1 rounded-lg border border-gray-100 bg-gray-50 p-4">
                  <JSONEditorComponent value={internalValue} onChange={handleChange} />
                </div>
                {onSave && (
                  <div className="flex items-center justify-end gap-4">
                    <Button variant="outline" onClick={onUpgrade} className="hover:bg-gray-50">
                      Upgrade
                    </Button>
                    <Button
                      disabled={!hasChanges}
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:hover:bg-gray-300"
                    >
                      Update
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        );

      case 'no-code':
        return (
          <DialogContent className="h-[85vh] min-w-[85vw] overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
            {noCodeDialogContent ? (
              noCodeDialogContent
            ) : (
              <div className="flex h-full flex-col gap-6">
                <div className="flex-1 rounded-lg border border-gray-100 bg-gray-50 p-4">
                  {/* TODO: Implement no-code editor UI */}
                  <div>No-code editor coming soon</div>
                </div>
                {onSave && (
                  <div className="flex items-center justify-end gap-4">
                    <Button variant="outline" onClick={onUpgrade} className="hover:bg-gray-50">
                      Upgrade
                    </Button>
                    <Button
                      disabled={!hasChanges}
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:hover:bg-gray-300"
                    >
                      Update
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={!!dialogMode}
      onOpenChange={open => {
        if (!open) {
          setSnapshot(value);
          setInternalValue(value);
          setDialogMode(undefined);
        }

        onOpenChange?.(open);
      }}
    >
      <Card className="flex h-full flex-col bg-white shadow-lg transition-shadow duration-200 hover:shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 px-6 py-4">
          <span className="text-lg font-semibold text-gray-800">{title}</span>
          <div className="flex flex-row items-center gap-2">
            <DialogTrigger
              asChild
              disabled={!enableViewMode}
              onClick={() => enableViewMode && setDialogMode('view')}
            >
              <Eye
                className={`h-5 w-5 cursor-pointer transition-all duration-200 ease-in-out hover:scale-110 ${
                  enableViewMode
                    ? 'text-gray-400 hover:text-blue-500'
                    : 'cursor-not-allowed text-gray-200'
                }`}
              />
            </DialogTrigger>

            <DialogTrigger
              asChild
              disabled={!enableNoCodeMode}
              onClick={() => enableNoCodeMode && setDialogMode('no-code')}
            >
              <Pencil
                className={`h-5 w-5 cursor-pointer transition-all duration-200 ease-in-out hover:scale-110 ${
                  enableNoCodeMode
                    ? 'text-gray-400 hover:text-blue-500'
                    : 'cursor-not-allowed text-gray-200'
                }`}
              />
            </DialogTrigger>
            <DialogTrigger asChild onClick={() => setDialogMode('raw-edit')}>
              <Code className="h-5 w-5 cursor-pointer text-gray-400 transition-all duration-200 ease-in-out hover:scale-110 hover:text-blue-500" />
            </DialogTrigger>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-6">
          <JSONEditorComponent readOnly value={value} />
        </CardContent>
      </Card>

      {renderDialogContent()}
    </Dialog>
  );
};
