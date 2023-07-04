import { memo, useLayoutEffect, useMemo, useRef } from 'react';
import { inspect } from '@xstate/inspect';
import { createMachine } from 'xstate';
import { useInterpret, useMachine } from '@xstate/react';
import { deserializeStateDefinition } from '@app/components/organisms/XstateVisualizer/utils/deserialize-state-definition';

interface Props {
  stateDefinition: Record<string, any>;
  state?: string;
}

export const XstateVisualizer = memo(({ stateDefinition, state }: Props) => {
  const _machine = useMemo(
    () =>
      createMachine(
        deserializeStateDefinition({
          ...stateDefinition,
          initial: state || stateDefinition.initial,
        }),
      ),
    [stateDefinition, state],
  );
  const [stateMachine] = useMachine(_machine);

  useInterpret(_machine, { devTools: true });

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useLayoutEffect(() => {
    if (!iframeRef.current) return;

    inspect({ iframe: iframeRef.current });
  }, [iframeRef, state, stateMachine.value]);

  return (
    <div className="h-full w-full">
      <iframe
        ref={iframeRef}
        data-xstate
        style={{ width: 'calc(100% + clamp(40rem, 40rem + 0px, 100%))' }}
        // width="100%"
        height="100%"
      />
    </div>
  );
});
