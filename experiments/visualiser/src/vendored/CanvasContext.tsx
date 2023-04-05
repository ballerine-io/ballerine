import { InterpreterFrom } from 'xstate';
import { canvasMachine } from './canvasMachine';
import { createRequiredContext } from './utils';

export const [CanvasProvider, useCanvas] = createRequiredContext<
  InterpreterFrom<typeof canvasMachine>
>('Canvas');
