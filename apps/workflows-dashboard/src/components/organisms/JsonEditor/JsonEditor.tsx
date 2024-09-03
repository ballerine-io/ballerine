import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';
import { FunctionComponent, useEffect, useRef } from 'react';

interface IJSONEditorProps {
  value: any;
  readOnly?: boolean;
  onChange?: (value: any) => void;
}

export const JSONEditorComponent: FunctionComponent<IJSONEditorProps> = ({
  value,
  readOnly,
  onChange,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<JSONEditor | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (editorRef.current) return;

    editorRef.current = new JSONEditor(containerRef.current!, {
      onChange: () => {
        editorRef.current && onChange && onChange(editorRef.current.get());
      },
    });
  }, [containerRef, editorRef]);

  useEffect(() => {
    if (!editorRef.current) return;

    //TODO: Each set of value rerenders editor and loses focus, find workarounds
    editorRef.current.set(value);
  }, [editorRef, readOnly]);

  useEffect(() => {
    if (!editorRef.current) return;

    if (readOnly) {
      editorRef.current.set(value);
    }
  }, [editorRef, readOnly, value]);

  useEffect(() => {
    if (!editorRef.current) return;

    editorRef.current.setMode(readOnly ? 'view' : 'code');
  }, [readOnly]);

  return <div className="h-full" ref={containerRef} />;
};
