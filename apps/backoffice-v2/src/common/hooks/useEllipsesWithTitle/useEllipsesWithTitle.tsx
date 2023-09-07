import { CSSProperties, useLayoutEffect, useRef } from 'react';

export const useEllipsesWithTitle = <THTMLElement extends HTMLElement>() => {
  const ref = useRef<THTMLElement | null>(null);
  const childOffsetWidth = ref.current?.offsetWidth;
  const parentOffsetWidth = ref.current?.parentElement?.offsetWidth;
  const styles: CSSProperties = {
    // display: 'inline-block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
  };

  useLayoutEffect(() => {
    if (childOffsetWidth !== parentOffsetWidth) {
      ref.current?.removeAttribute('title');

      return;
    }

    ref.current?.setAttribute('title', ref.current?.textContent ?? '');
  }, [childOffsetWidth, parentOffsetWidth]);

  return {
    ref,
    styles,
  };
};
