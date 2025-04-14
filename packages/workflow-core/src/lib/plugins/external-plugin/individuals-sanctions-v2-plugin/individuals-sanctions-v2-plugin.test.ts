import { ProcessStatus, UnifiedApiReason } from '@ballerine/common';
import nock from 'nock';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IndividualsSanctionsV2Plugin } from './individuals-sanctions-v2-plugin';

describe('IndividualsSanctionsV2Plugin', () => {
  beforeEach(() => {
    nock.disableNetConnect();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  describe('when a JMESPath request transformer is passed', () => {
    it('should error', () => {
      // Arrange
      const pluginParams = {
        url: 'http://test.com',
        method: 'POST',
        name: 'sanctionsScreening',
        pluginKind: 'individual-sanctions-v2',
        stateNames: ['run_ongoing_aml'],
        displayName: 'Sanctions Screening',
        errorAction: 'ONGOING_AML_FAILED',
        successAction: 'ONGOING_AML_SUCCESS',
        payload: {
          clientId: 'clientId',
          vendor: 'dow-jones',
          ongoingMonitoring: true,
          immediateResults: true,
          workflowRuntimeId: {
            __type: 'path',
            value: 'workflowRuntimeId',
          },
          endUserId: {
            __type: 'path',
            value: 'entity.data.additionalInfo.mainRepresentative.ballerineEntityId',
          },
          kycInformation: {
            __type: 'path',
            value: 'childWorkflows.kyc_email_session_example',
          },
        },
        request: {
          transformers: [
            {
              name: 'jmespath-transformer',
              type: 'jmespath',
              transform: async data => data,
              mapping: '{ data: @ }',
            },
          ],
        },
      } satisfies ConstructorParameters<typeof IndividualsSanctionsV2Plugin>[0];

      // Act

      // Assert
      expect(() => new IndividualsSanctionsV2Plugin(pluginParams)).toThrowError(
        'Individuals Sanctions V2 Plugin - JMESPath request transformers are not supported',
      );
    });
  });

  describe('when a JMESPath response transformer is passed', () => {
    it('should error', () => {
      // Arrange
      const pluginParams = {
        url: 'http://test.com',
        method: 'POST',
        name: 'sanctionsScreening',
        pluginKind: 'individual-sanctions-v2',
        stateNames: ['run_ongoing_aml'],
        displayName: 'Sanctions Screening',
        errorAction: 'ONGOING_AML_FAILED',
        successAction: 'ONGOING_AML_SUCCESS',
        payload: {
          clientId: 'clientId',
          vendor: 'dow-jones',
          ongoingMonitoring: true,
          immediateResults: true,
          workflowRuntimeId: {
            __type: 'path',
            value: 'workflowRuntimeId',
          },
          endUserId: {
            __type: 'path',
            value: 'entity.data.additionalInfo.mainRepresentative.ballerineEntityId',
          },
          kycInformation: {
            __type: 'path',
            value: 'childWorkflows.kyc_email_session_example',
          },
        },
        response: {
          transformers: [
            {
              name: 'jmespath-transformer',
              type: 'jmespath',
              transform: async data => data,
              mapping: '{ data: @ }',
            },
          ],
        },
      } satisfies ConstructorParameters<typeof IndividualsSanctionsV2Plugin>[0];

      // Act

      // Assert
      expect(() => new IndividualsSanctionsV2Plugin(pluginParams)).toThrowError(
        'Individuals Sanctions V2 Plugin - JMESPath response transformers are not supported',
      );
    });
  });

  describe('when a non-JMESPath request transformer is passed', () => {
    it('should not error', () => {
      // Arrange
      const pluginParams = {
        url: 'http://test.com',
        method: 'POST',
        name: 'sanctionsScreening',
        pluginKind: 'individual-sanctions-v2',
        stateNames: ['run_ongoing_aml'],
        displayName: 'Sanctions Screening',
        errorAction: 'ONGOING_AML_FAILED',
        successAction: 'ONGOING_AML_SUCCESS',
        payload: {
          clientId: 'clientId',
          vendor: 'dow-jones',
          ongoingMonitoring: true,
          immediateResults: true,
          workflowRuntimeId: {
            __type: 'path',
            value: 'workflowRuntimeId',
          },
          endUserId: {
            __type: 'path',
            value: 'entity.data.additionalInfo.mainRepresentative.ballerineEntityId',
          },
          kycInformation: {
            __type: 'path',
            value: 'childWorkflows.kyc_email_session_example',
          },
        },
        request: {
          transformers: [
            {
              name: 'helper-transformer',
              type: 'helper',
              transform: async data => data,
              mapping: 'some mapping',
            },
          ],
        },
      } satisfies ConstructorParameters<typeof IndividualsSanctionsV2Plugin>[0];

      // Act

      // Assert
      expect(() => new IndividualsSanctionsV2Plugin(pluginParams)).not.toThrowError(
        'Individuals Sanctions V2 Plugin - JMESPath response transformers are not supported',
      );
    });
  });

  describe('when a non-JMESPath response transformer is passed', () => {
    it('should not error', () => {
      // Arrange
      const pluginParams = {
        url: 'http://test.com',
        method: 'POST',
        name: 'sanctionsScreening',
        pluginKind: 'individual-sanctions-v2',
        stateNames: ['run_ongoing_aml'],
        displayName: 'Sanctions Screening',
        errorAction: 'ONGOING_AML_FAILED',
        successAction: 'ONGOING_AML_SUCCESS',
        payload: {
          clientId: 'clientId',
          vendor: 'dow-jones',
          ongoingMonitoring: true,
          immediateResults: true,
          workflowRuntimeId: {
            __type: 'path',
            value: 'workflowRuntimeId',
          },
          endUserId: {
            __type: 'path',
            value: 'entity.data.additionalInfo.mainRepresentative.ballerineEntityId',
          },
          kycInformation: {
            __type: 'path',
            value: 'childWorkflows.kyc_email_session_example',
          },
        },
        response: {
          transformers: [
            {
              name: 'helper-transformer',
              type: 'helper',
              transform: async data => data,
              mapping: 'some mapping',
            },
          ],
        },
      } satisfies ConstructorParameters<typeof IndividualsSanctionsV2Plugin>[0];

      // Act

      // Assert
      expect(() => new IndividualsSanctionsV2Plugin(pluginParams)).not.toThrowError(
        'Individuals Sanctions V2 Plugin - JMESPath response transformers are not supported',
      );
    });
  });

  describe('when the required environment variables are invalid', () => {
    it('should error', () => {
      // Arrange
      vi.stubEnv('UNIFIED_API_URL', '');
      vi.stubEnv('UNIFIED_API_KEY', '');
      vi.stubEnv('APP_API_URL', '');
      const pluginParams = {
        url: 'http://test.com',
        method: 'POST',
        name: 'sanctionsScreening',
        pluginKind: 'individual-sanctions-v2',
        stateNames: ['run_ongoing_aml'],
        displayName: 'Sanctions Screening',
        errorAction: 'ONGOING_AML_FAILED',
        successAction: 'ONGOING_AML_SUCCESS',
        payload: {
          clientId: 'clientId',
          vendor: 'dow-jones',
          ongoingMonitoring: true,
          immediateResults: true,
          workflowRuntimeId: {
            __type: 'path',
            value: 'workflowRuntimeId',
          },
          endUserId: {
            __type: 'path',
            value: 'entity.data.additionalInfo.mainRepresentative.ballerineEntityId',
          },
          kycInformation: {
            __type: 'path',
            value: 'childWorkflows.kyc_email_session_example',
          },
        },
      } satisfies ConstructorParameters<typeof IndividualsSanctionsV2Plugin>[0];
      const plugin = new IndividualsSanctionsV2Plugin(pluginParams);
      const invokePromise = plugin.invoke({});

      // Act

      // Assert
      void expect(invokePromise).rejects.toThrowError('Invalid environment variables');
    });
  });

  describe('when a payload without literal properties is passed', () => {
    it('should return an API plugin error object', async () => {
      // Arrange
      vi.stubEnv('UNIFIED_API_URL', 'http://unified-api.test.com');
      vi.stubEnv('UNIFIED_API_TOKEN', 'test');
      vi.stubEnv('APP_API_URL', 'http://workflows-service.test.com');
      const pluginParams = {
        url: 'http://test.com',
        method: 'POST',
        name: 'sanctionsScreening',
        pluginKind: 'individual-sanctions-v2',
        stateNames: ['run_ongoing_aml'],
        displayName: 'Sanctions Screening',
        errorAction: 'ONGOING_AML_FAILED',
        successAction: 'ONGOING_AML_SUCCESS',
        // @ts-expect-error -- testing invalid payload
        payload: {
          workflowRuntimeId: {
            __type: 'path',
            value: 'workflowRuntimeId',
          },
          endUserId: {
            __type: 'path',
            value: 'entity.data.additionalInfo.mainRepresentative.ballerineEntityId',
          },
          kycInformation: {
            __type: 'path',
            value: 'childWorkflows.kyc_email_session_example',
          },
        },
      } satisfies ConstructorParameters<typeof IndividualsSanctionsV2Plugin>[0];
      const plugin = new IndividualsSanctionsV2Plugin(
        // @ts-expect-error -- testing invalid payload
        pluginParams,
      );
      const invokePayload = {
        workflowRuntimeId: 'workflowRuntimeId',
        entity: {
          data: {
            additionalInfo: {
              mainRepresentative: {
                ballerineEntityId: 'ballerineEntityId',
              },
            },
          },
        },
        childWorkflows: {
          kyc_email_session_example: {
            cliydrj090000rywd5m9z4ec3: {
              result: {
                vendorResult: {
                  entity: {
                    data: {
                      firstName: 'John',
                      lastName: 'Doe',
                      dateOfBirth: '1980-01-01',
                    },
                  },
                },
              },
            },
          },
        },
      };

      // Act
      const invokeResponse = await plugin.invoke(invokePayload);

      // Assert
      expect(invokeResponse).toMatchObject({
        callbackAction: 'ONGOING_AML_FAILED',
        error: expect.any(String),
      });
    });
  });

  describe('when a payload without path properties is passed', () => {
    it('should return an API plugin error object', async () => {
      // Arrange
      vi.stubEnv('UNIFIED_API_URL', 'http://unified-api.test.com');
      vi.stubEnv('UNIFIED_API_TOKEN', 'test');
      vi.stubEnv('APP_API_URL', 'http://workflows-service.test.com');
      const pluginParams = {
        url: 'http://test.com',
        method: 'POST',
        name: 'sanctionsScreening',
        pluginKind: 'individual-sanctions-v2',
        stateNames: ['run_ongoing_aml'],
        displayName: 'Sanctions Screening',
        errorAction: 'ONGOING_AML_FAILED',
        successAction: 'ONGOING_AML_SUCCESS',
        // @ts-expect-error -- testing invalid payload
        payload: {
          clientId: 'clientId',
          vendor: 'dow-jones',
          ongoingMonitoring: true,
          immediateResults: false,
        },
      } satisfies ConstructorParameters<typeof IndividualsSanctionsV2Plugin>[0];
      const plugin = new IndividualsSanctionsV2Plugin(
        // @ts-expect-error -- testing invalid payload
        pluginParams,
      );
      const invokePayload = {
        workflowRuntimeId: 'workflowRuntimeId',
        entity: {
          data: {
            additionalInfo: {
              mainRepresentative: {
                ballerineEntityId: 'ballerineEntityId',
              },
            },
          },
        },
        childWorkflows: {
          kyc_email_session_example: {
            cliydrj090000rywd5m9z4ec3: {
              result: {
                vendorResult: {
                  entity: {
                    data: {
                      firstName: 'John',
                      lastName: 'Doe',
                      dateOfBirth: '1980-01-01',
                    },
                  },
                },
              },
            },
          },
        },
      };

      // Act
      const invokeResponse = await plugin.invoke(invokePayload);

      // Assert
      expect(invokeResponse).toMatchObject({
        callbackAction: 'ONGOING_AML_FAILED',
        error: expect.any(String),
      });
    });
  });

  describe('when an array is passed to kycInformation', () => {
    it('should pass validation', async () => {
      // Arrange
      vi.stubEnv('UNIFIED_API_URL', 'http://unified-api.test.com');
      vi.stubEnv('UNIFIED_API_TOKEN', 'test');
      vi.stubEnv('APP_API_URL', 'http://workflows-service.test.com');
      let response: { body: string } | undefined;
      vi.stubGlobal(
        'fetch',
        vi.fn(async (_url, { body }) => {
          response = {
            body,
          };

          return new Response(
            JSON.stringify({
              data: {},
            }),
          );
        }),
      );
      const pluginParams = {
        url: 'http://test.com',
        method: 'POST',
        name: 'sanctionsScreening',
        pluginKind: 'individual-sanctions-v2',
        stateNames: ['run_ongoing_aml'],
        displayName: 'Sanctions Screening',
        errorAction: 'ONGOING_AML_FAILED',
        successAction: 'ONGOING_AML_SUCCESS',
        payload: {
          clientId: 'clientId',
          vendor: 'dow-jones',
          ongoingMonitoring: true,
          immediateResults: false,
          workflowRuntimeId: {
            __type: 'path',
            value: 'workflowRuntimeId',
          },
          endUserId: {
            __type: 'path',
            value: 'entity.data.additionalInfo.mainRepresentative.ballerineEntityId',
          },
          kycInformation: {
            __type: 'path',
            value: 'entity.data.additionalInfo.ubos',
          },
        },
      } satisfies ConstructorParameters<typeof IndividualsSanctionsV2Plugin>[0];
      const plugin = new IndividualsSanctionsV2Plugin(pluginParams);
      const invokePayload = {
        workflowRuntimeId: 'workflowRuntimeId',
        entity: {
          data: {
            additionalInfo: {
              mainRepresentative: {
                ballerineEntityId: 'ballerineEntityId',
              },
              ubos: [
                {
                  firstName: 'John',
                  lastName: 'Doe',
                  additionalInfo: {
                    dateOfBirth: '1980-01-01',
                  },
                },
              ],
            },
          },
        },
      };

      // Act
      const invokeResponse = await plugin.invoke(invokePayload);

      // Assert
      expect(invokeResponse).toHaveProperty('callbackAction', 'ONGOING_AML_SUCCESS');
      expect(invokeResponse).not.toHaveProperty('error');
      expect(JSON.parse(response?.body ?? '')).toMatchObject(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1980-01-01',
        }),
      );
    });
  });

  describe('when an object with KYC information at its root is passed to kycInformation', () => {
    describe('when dateOfBirth is present in additionalInfo', () => {
      it('should pass validation', async () => {
        // Arrange
        vi.stubEnv('UNIFIED_API_URL', 'http://unified-api.test.com');
        vi.stubEnv('UNIFIED_API_TOKEN', 'test');
        vi.stubEnv('APP_API_URL', 'http://workflows-service.test.com');
        let response: { body: string } | undefined;
        vi.stubGlobal(
          'fetch',
          vi.fn(async (_url, { body }) => {
            response = {
              body,
            };

            return new Response(
              JSON.stringify({
                data: {},
              }),
            );
          }),
        );
        const pluginParams = {
          url: 'http://test.com',
          method: 'POST',
          name: 'sanctionsScreening',
          pluginKind: 'individual-sanctions-v2',
          stateNames: ['run_ongoing_aml'],
          displayName: 'Sanctions Screening',
          errorAction: 'ONGOING_AML_FAILED',
          successAction: 'ONGOING_AML_SUCCESS',
          payload: {
            clientId: 'clientId',
            vendor: 'dow-jones',
            ongoingMonitoring: true,
            immediateResults: false,
            workflowRuntimeId: {
              __type: 'path',
              value: 'workflowRuntimeId',
            },
            endUserId: {
              __type: 'path',
              value: 'entity.data.additionalInfo.mainRepresentative.ballerineEntityId',
            },
            kycInformation: {
              __type: 'path',
              value: 'entity.data',
            },
          },
        } satisfies ConstructorParameters<typeof IndividualsSanctionsV2Plugin>[0];
        const plugin = new IndividualsSanctionsV2Plugin(pluginParams);
        const invokePayload = {
          workflowRuntimeId: 'workflowRuntimeId',
          entity: {
            data: {
              firstName: 'John',
              lastName: 'Doe',
              additionalInfo: {
                mainRepresentative: {
                  ballerineEntityId: 'ballerineEntityId',
                },
                dateOfBirth: '1980-01-01',
              },
            },
          },
        };

        // Act
        const invokeResponse = await plugin.invoke(invokePayload);

        // Assert
        expect(invokeResponse).toHaveProperty('callbackAction', 'ONGOING_AML_SUCCESS');
        expect(invokeResponse).not.toHaveProperty('error');
        expect(JSON.parse(response?.body ?? '')).toMatchObject(
          expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1980-01-01',
          }),
        );
      });
    });
    describe('when dateOfBirth is present at root level', () => {
      it('should pass validation', async () => {
        // Arrange
        vi.stubEnv('UNIFIED_API_URL', 'http://unified-api.test.com');
        vi.stubEnv('UNIFIED_API_TOKEN', 'test');
        vi.stubEnv('APP_API_URL', 'http://workflows-service.test.com');
        let response: { body: string } | undefined;
        vi.stubGlobal(
          'fetch',
          vi.fn(async (_url, { body }) => {
            response = {
              body,
            };

            return new Response(
              JSON.stringify({
                data: {},
              }),
            );
          }),
        );
        const pluginParams = {
          url: 'http://test.com',
          method: 'POST',
          name: 'sanctionsScreening',
          pluginKind: 'individual-sanctions-v2',
          stateNames: ['run_ongoing_aml'],
          displayName: 'Sanctions Screening',
          errorAction: 'ONGOING_AML_FAILED',
          successAction: 'ONGOING_AML_SUCCESS',
          payload: {
            clientId: 'clientId',
            vendor: 'dow-jones',
            ongoingMonitoring: true,
            immediateResults: false,
            workflowRuntimeId: {
              __type: 'path',
              value: 'workflowRuntimeId',
            },
            endUserId: {
              __type: 'path',
              value: 'entity.data.additionalInfo.mainRepresentative.ballerineEntityId',
            },
            kycInformation: {
              __type: 'path',
              value: 'entity.data',
            },
          },
        } satisfies ConstructorParameters<typeof IndividualsSanctionsV2Plugin>[0];
        const plugin = new IndividualsSanctionsV2Plugin(pluginParams);
        const invokePayload = {
          workflowRuntimeId: 'workflowRuntimeId',
          entity: {
            data: {
              firstName: 'John',
              lastName: 'Doe',
              dateOfBirth: '1980-01-01',
              additionalInfo: {
                mainRepresentative: {
                  ballerineEntityId: 'ballerineEntityId',
                },
              },
            },
          },
        };

        // Act
        const invokeResponse = await plugin.invoke(invokePayload);

        // Assert
        expect(invokeResponse).toHaveProperty('callbackAction', 'ONGOING_AML_SUCCESS');
        expect(invokeResponse).not.toHaveProperty('error');
        expect(JSON.parse(response?.body ?? '')).toMatchObject(
          expect.objectContaining({
            firstName: 'John',
            lastName: 'Doe',
            dateOfBirth: '1980-01-01',
          }),
        );
      });
    });
  });

  describe('when an object of objects is passed to kycInformation', () => {
    it('should pass validation', async () => {
      // Arrange
      vi.stubEnv('UNIFIED_API_URL', 'http://unified-api.test.com');
      vi.stubEnv('UNIFIED_API_TOKEN', 'test');
      vi.stubEnv('APP_API_URL', 'http://workflows-service.test.com');
      let response: { body: string } | undefined;
      vi.stubGlobal(
        'fetch',
        vi.fn(async (_url, { body }) => {
          response = {
            body,
          };

          return new Response(
            JSON.stringify({
              data: {},
            }),
          );
        }),
      );
      const pluginParams = {
        url: 'http://test.com',
        method: 'POST',
        name: 'sanctionsScreening',
        pluginKind: 'individual-sanctions-v2',
        stateNames: ['run_ongoing_aml'],
        displayName: 'Sanctions Screening',
        errorAction: 'ONGOING_AML_FAILED',
        successAction: 'ONGOING_AML_SUCCESS',
        payload: {
          clientId: 'clientId',
          vendor: 'dow-jones',
          ongoingMonitoring: true,
          immediateResults: false,
          workflowRuntimeId: {
            __type: 'path',
            value: 'workflowRuntimeId',
          },
          endUserId: {
            __type: 'path',
            value: 'entity.data.additionalInfo.mainRepresentative.ballerineEntityId',
          },
          kycInformation: {
            __type: 'path',
            value: 'childWorkflows.kyc_email_session_example',
          },
        },
      } satisfies ConstructorParameters<typeof IndividualsSanctionsV2Plugin>[0];
      const plugin = new IndividualsSanctionsV2Plugin(pluginParams);
      const invokePayload = {
        workflowRuntimeId: 'workflowRuntimeId',
        entity: {
          data: {
            additionalInfo: {
              mainRepresentative: {
                ballerineEntityId: 'ballerineEntityId',
              },
            },
          },
        },
        childWorkflows: {
          kyc_email_session_example: {
            cliydrj090000rywd5m9z4ec3: {
              result: {
                vendorResult: {
                  entity: {
                    data: {
                      firstName: 'John',
                      lastName: 'Doe',
                      dateOfBirth: '1980-01-01',
                    },
                  },
                },
              },
            },
          },
        },
      };

      // Act
      const invokeResponse = await plugin.invoke(invokePayload);

      // Assert
      expect(invokeResponse).toHaveProperty('callbackAction', 'ONGOING_AML_SUCCESS');
      expect(invokeResponse).not.toHaveProperty('error');
      expect(JSON.parse(response?.body ?? '')).toMatchObject(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1980-01-01',
        }),
      );
    });
  });

  describe("when invoke's API call responds with an error property", () => {
    it("should return the plugin's error metadata", async () => {
      // Arrange
      vi.stubEnv('UNIFIED_API_URL', 'http://unified-api.test.com');
      vi.stubEnv('UNIFIED_API_TOKEN', 'test');
      vi.stubEnv('APP_API_URL', 'http://workflows-service.test.com');
      vi.stubGlobal(
        'fetch',
        vi.fn(async () => {
          return new Response(
            JSON.stringify({
              error: 'Something went wrong',
            }),
          );
        }),
      );
      const pluginParams = {
        url: 'http://test.com',
        method: 'POST',
        name: 'sanctionsScreening',
        pluginKind: 'individual-sanctions-v2',
        stateNames: ['run_ongoing_aml'],
        displayName: 'Sanctions Screening',
        errorAction: 'ONGOING_AML_FAILED',
        successAction: 'ONGOING_AML_SUCCESS',
        payload: {
          clientId: 'clientId',
          vendor: 'dow-jones',
          ongoingMonitoring: true,
          immediateResults: false,
          workflowRuntimeId: {
            __type: 'path',
            value: 'workflowRuntimeId',
          },
          endUserId: {
            __type: 'path',
            value: 'entity.data.additionalInfo.mainRepresentative.ballerineEntityId',
          },
          kycInformation: {
            __type: 'path',
            value: 'childWorkflows.kyc_email_session_example',
          },
        },
      } satisfies ConstructorParameters<typeof IndividualsSanctionsV2Plugin>[0];
      const plugin = new IndividualsSanctionsV2Plugin(pluginParams);
      const invokePayload = {
        workflowRuntimeId: 'workflowRuntimeId',
        entity: {
          data: {
            additionalInfo: {
              mainRepresentative: {
                ballerineEntityId: 'ballerineEntityId',
              },
            },
          },
        },
        childWorkflows: {
          kyc_email_session_example: {
            cliydrj090000rywd5m9z4ec3: {
              result: {
                vendorResult: {
                  entity: {
                    data: {
                      firstName: 'John',
                      lastName: 'Doe',
                      dateOfBirth: '1980-01-01',
                    },
                  },
                },
              },
            },
          },
        },
      };

      // Act
      const invokeResponse = await plugin.invoke(invokePayload);

      // Assert
      expect(invokeResponse).toMatchObject({
        // Right now JMESPath expressions look for a property
        // called 'error' in the response body for a plugin's status.
        // If response.ok is false 'invoke' returns right after the fetch call
        // without running response transformers, thus this flow is the only way
        // to get a status of 'ERROR' outside the workflow runner with response.ok true.
        // See WorkflowRunner.__invokeApiPlugin for reference.
        callbackAction: 'ONGOING_AML_SUCCESS',
        responseBody: {
          name: 'sanctionsScreening',
          error: 'Something went wrong',
          status: ProcessStatus.ERROR,
        },
      });
    });
  });

  describe("when invoke's API call responds with reason 'NOT_IMPLEMENTED'", () => {
    it("should return the plugin's metadata with a status of 'CANCELED'", async () => {
      // Arrange
      vi.stubEnv('UNIFIED_API_URL', 'http://unified-api.test.com');
      vi.stubEnv('UNIFIED_API_TOKEN', 'test');
      vi.stubEnv('APP_API_URL', 'http://workflows-service.test.com');
      vi.stubGlobal(
        'fetch',
        vi.fn(async () => {
          return new Response(
            JSON.stringify({
              reason: UnifiedApiReason.NOT_IMPLEMENTED,
            }),
          );
        }),
      );
      const pluginParams = {
        url: 'http://test.com',
        method: 'POST',
        name: 'sanctionsScreening',
        pluginKind: 'individual-sanctions-v2',
        stateNames: ['run_ongoing_aml'],
        displayName: 'Sanctions Screening',
        errorAction: 'ONGOING_AML_FAILED',
        successAction: 'ONGOING_AML_SUCCESS',
        payload: {
          clientId: 'clientId',
          vendor: 'dow-jones',
          ongoingMonitoring: true,
          immediateResults: false,
          workflowRuntimeId: {
            __type: 'path',
            value: 'workflowRuntimeId',
          },
          endUserId: {
            __type: 'path',
            value: 'entity.data.additionalInfo.mainRepresentative.ballerineEntityId',
          },
          kycInformation: {
            __type: 'path',
            value: 'childWorkflows.kyc_email_session_example',
          },
        },
      } satisfies ConstructorParameters<typeof IndividualsSanctionsV2Plugin>[0];
      const plugin = new IndividualsSanctionsV2Plugin(pluginParams);
      const invokePayload = {
        workflowRuntimeId: 'workflowRuntimeId',
        entity: {
          data: {
            additionalInfo: {
              mainRepresentative: {
                ballerineEntityId: 'ballerineEntityId',
              },
            },
          },
        },
        childWorkflows: {
          kyc_email_session_example: {
            cliydrj090000rywd5m9z4ec3: {
              result: {
                vendorResult: {
                  entity: {
                    data: {
                      firstName: 'John',
                      lastName: 'Doe',
                      dateOfBirth: '1980-01-01',
                    },
                  },
                },
              },
            },
          },
        },
      };

      // Act
      const invokeResponse = await plugin.invoke(invokePayload);

      // Assert
      expect(invokeResponse).toMatchObject({
        callbackAction: 'ONGOING_AML_SUCCESS',
        responseBody: {
          name: 'sanctionsScreening',
          reason: 'NOT_IMPLEMENTED',
          status: ProcessStatus.CANCELED,
        },
      });
    });
  });

  describe('when invoke succeeds', () => {
    it("should return the plugin's success metadata", async () => {
      // Arrange
      vi.stubEnv('UNIFIED_API_URL', 'http://unified-api.test.com');
      vi.stubEnv('UNIFIED_API_TOKEN', 'test');
      vi.stubEnv('APP_API_URL', 'http://workflows-service.test.com');
      vi.stubGlobal(
        'fetch',
        vi.fn(async () => {
          return new Response(
            JSON.stringify({
              data: {},
              invokedAt: Date.now(),
            }),
          );
        }),
      );

      const pluginParams = {
        url: 'http://test.com',
        method: 'POST',
        name: 'sanctionsScreening',
        pluginKind: 'individual-sanctions-v2',
        stateNames: ['run_ongoing_aml'],
        displayName: 'Sanctions Screening',
        errorAction: 'ONGOING_AML_FAILED',
        successAction: 'ONGOING_AML_SUCCESS',
        payload: {
          clientId: 'clientId',
          vendor: 'dow-jones',
          ongoingMonitoring: true,
          immediateResults: false,
          workflowRuntimeId: {
            __type: 'path',
            value: 'workflowRuntimeId',
          },
          endUserId: {
            __type: 'path',
            value: 'entity.data.additionalInfo.mainRepresentative.ballerineEntityId',
          },
          kycInformation: {
            __type: 'path',
            value: 'childWorkflows.kyc_email_session_example',
          },
        },
      } satisfies ConstructorParameters<typeof IndividualsSanctionsV2Plugin>[0];
      const plugin = new IndividualsSanctionsV2Plugin(pluginParams);
      const invokePayload = {
        workflowRuntimeId: 'workflowRuntimeId',
        entity: {
          data: {
            additionalInfo: {
              mainRepresentative: {
                ballerineEntityId: 'ballerineEntityId',
              },
            },
          },
        },
        childWorkflows: {
          kyc_email_session_example: {
            cliydrj090000rywd5m9z4ec3: {
              result: {
                vendorResult: {
                  entity: {
                    data: {
                      firstName: 'John',
                      lastName: 'Doe',
                      dateOfBirth: '1980-01-01',
                    },
                  },
                },
              },
            },
          },
        },
      };

      // Act
      const invokeResponse = await plugin.invoke(invokePayload);

      // Assert
      expect(invokeResponse).toMatchObject({
        callbackAction: 'ONGOING_AML_SUCCESS',
        responseBody: {
          data: {},
          name: 'sanctionsScreening',
          status: ProcessStatus.IN_PROGRESS,
          invokedAt: expect.any(Number),
        },
      });
    });
  });
});
