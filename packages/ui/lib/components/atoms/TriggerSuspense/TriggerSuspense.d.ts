import { FunctionComponent } from 'react';
import type { ITriggerSuspenseProps } from './interfaces';
/**
 * @description Conditionally throws a promise to trigger suspense boundaries
 * @param [throwPromise=true] - Throws a promise if true, otherwise returns null
 * @throws {Promise} - Throws a promise to trigger suspense boundaries
 * @constructor
 */
export declare const TriggerSuspense: FunctionComponent<ITriggerSuspenseProps>;
