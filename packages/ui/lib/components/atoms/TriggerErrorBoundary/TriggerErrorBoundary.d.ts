import { FunctionComponent } from 'react';
import type { ITriggerErrorBoundaryProps } from './interfaces';
/**
 * @description Conditionally throws an error to trigger error boundaries
 * @param [throwError=true] - Throws an error if true, otherwise returns null
 * @throws {Error} - Throws a promise to trigger suspense boundaries
 * @constructor
 */
export declare const TriggerErrorBoundary: FunctionComponent<ITriggerErrorBoundaryProps>;
