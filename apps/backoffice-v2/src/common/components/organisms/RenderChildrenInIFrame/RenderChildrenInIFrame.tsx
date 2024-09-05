import { FunctionComponentWithChildren } from '@ballerine/ui';
import { ComponentProps, useState } from 'react';
import { Portal } from '@/common/components/atoms/Portal/Portal';

export const RenderChildrenInIFrame: FunctionComponentWithChildren<ComponentProps<'iframe'>> = ({
  children,
  ...props
}) => {
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);
  const mountNode = contentRef?.contentWindow?.document?.body;

  return (
    <iframe {...props} ref={setContentRef}>
      {mountNode && <Portal target={mountNode}>{children}</Portal>}
    </iframe>
  );
};
