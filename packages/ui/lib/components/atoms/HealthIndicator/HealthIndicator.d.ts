/// <reference types="react" />
import { IWorkflowHealthStatus } from '../../../common/enums';
interface Props {
  healthStatus: IWorkflowHealthStatus;
  size?: number;
}
export declare const HealthIndicator: ({ healthStatus, size }: Props) => JSX.Element;
export {};
