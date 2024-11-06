import * as React from 'react';
import { ctw } from '@ballerine/ui';

import { Input } from '@/common/components/atoms/Input/Input';
import { Label } from '@/common/components/atoms/Label/Label';
import { Button } from '@/common/components/atoms/Button/Button';

export interface LinkEditorProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultUrl?: string;
  defaultText?: string;
  defaultIsNewTab?: boolean;
  onSave: (url: string, text?: string, isNewTab?: boolean) => void;
}

export const LinkEditBlock = React.forwardRef<HTMLDivElement, LinkEditorProps>(
  ({ onSave, defaultUrl, defaultText, className }, ref) => {
    const formRef = React.useRef<HTMLDivElement>(null);
    const [url, setUrl] = React.useState(defaultUrl || '');
    const [text, setText] = React.useState(defaultText || '');

    const handleSave = React.useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();

        if (formRef.current) {
          const isValid = Array.from(formRef.current.querySelectorAll('input')).every(input =>
            input.checkValidity(),
          );

          if (isValid) {
            onSave(url, text);
          } else {
            formRef.current.querySelectorAll('input').forEach(input => {
              if (!input.checkValidity()) {
                input.reportValidity();
              }
            });
          }
        }
      },
      [onSave, url, text],
    );

    React.useImperativeHandle(ref, () => formRef.current as HTMLDivElement);

    return (
      <div ref={formRef}>
        <div className={ctw('space-y-4', className)}>
          <div className="space-y-1">
            <Label>URL</Label>
            <Input
              type="url"
              required
              placeholder="Enter URL"
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <Label>Display Text (optional)</Label>
            <Input
              type="text"
              placeholder="Enter display text"
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

LinkEditBlock.displayName = 'LinkEditBlock';

export default LinkEditBlock;
