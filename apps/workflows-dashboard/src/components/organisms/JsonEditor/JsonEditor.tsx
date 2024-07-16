import JSONEditor from 'jsoneditor';
import { FunctionComponent, useEffect, useState } from 'react';

interface IJSONEditorProps {
  value: any;
}

export const JSONEditorComponent: FunctionComponent<IJSONEditorProps> = ({ value }) => {
  const [editor, setEditor] = useState<JSONEditor | null>(null);

  useEffect(() => {
    editor.set(value);
  }, [editor, value]);

  return <div>123</div>;
};
