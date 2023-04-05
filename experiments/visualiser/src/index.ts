import * as machine from './sample.workflow-definition.json';
import { interpret } from 'xstate';

const app = document.querySelector<HTMLDivElement>('#app')!;
