import { useCallback, useLayoutEffect, useRef } from 'react';

export const useDocumentListener = <TKey extends keyof DocumentEventMap>(
  event: TKey,
  cb: (event: DocumentEventMap[TKey]) => void,
) => {
  const ref = useRef(cb);
  const handler = useCallback((event: DocumentEventMap[TKey]) => ref.current?.(event), []);

  useLayoutEffect(() => {
    ref.current = cb;
  });

  useLayoutEffect(() => {
    document.addEventListener(event, handler, false);

    return () => {
      document.removeEventListener(event, handler, false);
    };
  }, [event, handler]);
};
