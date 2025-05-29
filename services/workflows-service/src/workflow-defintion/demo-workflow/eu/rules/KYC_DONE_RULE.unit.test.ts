import { KYC_DONE_RULE } from './index';
import { search } from 'jmespath';

describe('KYC_DONE_RULE #rule #unit', () => {
  describe('when there is no data', () => {
    it('returns false', () => {
      // Arrange
      const context = {};

      // Act
      const result = search(context, KYC_DONE_RULE());

      // Assert
      expect(result).toEqual(false);
    });
  });

  describe('when there are no child workflows', () => {
    it('returns false', () => {
      // Arrange
      const context = {
        childWorkflows: {},
      };

      // Act
      const result = search(context, KYC_DONE_RULE());

      // Assert
      expect(result).toEqual(false);
    });
  });

  describe('when there are no child workflows with an id of "kyc_email_session_example"', () => {
    it('returns false', () => {
      // Arrange
      const childWorkflows = {
        childWorkflows: {
          kyb_phone_session_example: {},
        },
      };

      // Act
      const result = search(childWorkflows, KYC_DONE_RULE());

      // Assert
      expect(result).toEqual(false);
    });
  });

  describe('when there are child workflows with an id of "kyc_email_session_example" but no results', () => {
    it.each([
      {
        context: {
          childWorkflows: {
            kyc_email_session_example: {
              'd4e9c9b7-0f6b-4c2b-8b4e-8e3e3c3a0b9b': {},
            },
          },
        },
        expected: false,
      },
      {
        context: {
          childWorkflows: {
            kyc_email_session_example: {
              'd4e9c9b7-0f6b-4c2b-8b4e-8e3e3c3a0b9b': {
                result: {},
              },
            },
          },
        },
        expected: false,
      },
      {
        context: {
          childWorkflows: {
            kyc_email_session_example: {
              'd4e9c9b7-0f6b-4c2b-8b4e-8e3e3c3a0b9b': {
                result: {
                  vendorResult: {},
                },
              },
            },
          },
        },
        expected: false,
      },
    ])('$context returns false', ({ context, expected }) => {
      // Act
      const result = search(context, KYC_DONE_RULE());

      // Assert
      expect(result).toEqual(expected);
    });
  });

  describe('when not all child workflows have a decision', () => {
    it('returns false', () => {
      // Arrange
      const context = {
        childWorkflows: {
          kyc_email_session_example: {
            'd4e9c9b7-0f6b-4c2b-8b4e-8e3e3c3a0b9b': {
              result: {
                vendorResult: {
                  decision: 'approved',
                },
              },
            },
            'd4e9c9b7-0f6b-4c2b-8b4e-8e3e3c3a0b9c': {
              result: {
                vendorResult: {},
              },
            },
          },
        },
      };

      // Act
      const result = search(context, KYC_DONE_RULE());

      // Assert
      expect(result).toEqual(false);
    });
  });

  describe('when all child workflows have a decision and no revision', () => {
    it('returns true', () => {
      // Arrange
      const context = {
        childWorkflows: {
          kyc_email_session_example: {
            'd4e9c9b7-0f6b-4c2b-8b4e-8e3e3c3a0b9b': {
              result: {
                vendorResult: {
                  decision: 'approved',
                },
              },
            },
            'd4e9c9b7-0f6b-4c2b-8b4e-8e3e3c3a0b9c': {
              result: {
                vendorResult: {
                  decision: 'rejected',
                },
              },
            },
          },
        },
      };

      // Act
      const result = search(context, KYC_DONE_RULE());

      // Assert
      expect(result).toEqual(true);
    });
  });

  describe('when all child workflows have a decision and some are in revision', () => {
    it('returns false', () => {
      // Arrange
      const context = {
        childWorkflows: {
          kyc_email_session_example: {
            'd4e9c9b7-0f6b-4c2b-8b4e-8e3e3c3a0b9b': {
              result: {
                vendorResult: {
                  decision: 'approved',
                },
              },
            },
            'd4e9c9b7-0f6b-4c2b-8b4e-8e3e3c3a0b9c': {
              result: {
                vendorResult: {
                  decision: 'rejected',
                },
              },
              state: 'revision',
            },
          },
        },
      };

      // Act
      const result = search(context, KYC_DONE_RULE());

      // Assert
      expect(result).toEqual(false);
    });
  });
});
