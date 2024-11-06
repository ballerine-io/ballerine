import { describe, expect, it } from 'vitest';
import { getOrderedSteps } from './get-ordered-steps';

describe('getOrderedSteps', () => {
  it('should return ordered steps', () => {
    const result = getOrderedSteps({
      initial: 'stepOne',
      states: {
        stepOne: {
          on: {
            NEXT: 'stepTwo',
          },
        },
        stepTwo: {
          on: {
            NEXT: 'stepThree',
          },
        },
        stepThree: {
          type: 'final',
        },
      },
    });

    expect(result).toEqual(['stepOne', 'stepTwo', 'stepThree']);
  });

  it('should return ordered steps without terminal states', () => {
    const result = getOrderedSteps(
      {
        initial: 'stepOne',
        states: {
          stepOne: {
            on: {
              NEXT: 'stepTwo',
            },
          },
          stepTwo: {
            on: {
              NEXT: 'stepThree',
            },
          },
          stepThree: {
            type: 'final',
          },
        },
      },
      { finalStates: ['stepThree'] },
    );

    expect(result).toEqual(['stepOne', 'stepTwo']);
  });
});
