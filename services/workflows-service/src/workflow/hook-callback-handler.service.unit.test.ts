import { HookCallbackHandlerService, setPluginStatus } from './hook-callback-handler.service';
import { ProcessStatus } from '@ballerine/common';
import type { WorkflowRuntimeData } from '@prisma/client';

describe('setPluginStatusToSuccess', () => {
  it('should set plugin status to success', () => {
    const resultDestinationPath = 'apiPlugins.merchantMonitoring.data';
    const context = {
      apiPlugins: {
        merchantMonitoring: {
          status: ProcessStatus.IN_PROGRESS,
        },
      },
    };
    const data = { key: 'value' };

    const result = setPluginStatus({
      resultDestinationPath,
      context,
      data,
      status: ProcessStatus.SUCCESS,
    });

    expect(result).toEqual({
      apiPlugins: {
        merchantMonitoring: {
          data: { key: 'value' },
          status: ProcessStatus.SUCCESS,
        },
      },
    });
  });

  it('should set plugin status to success when ignoreLastKey is false', () => {
    const resultDestinationPath = 'apiPlugins.merchantMonitoring';
    const context = {
      apiPlugins: {
        merchantMonitoring: {
          status: ProcessStatus.IN_PROGRESS,
        },
      },
    };
    const data = { key: 'value' };

    const result = setPluginStatus({
      resultDestinationPath,
      context,
      data,
      status: ProcessStatus.SUCCESS,
      ignoreLastKey: false,
    });

    expect(result).toEqual({
      apiPlugins: {
        merchantMonitoring: {
          data: { key: 'value' },
          status: ProcessStatus.SUCCESS,
        },
      },
    });
  });

  it('should not set status when result is not an object', () => {
    const resultDestinationPath = 'apiPlugins.merchantMonitoring';
    const context = { apiPlugins: { merchantMonitoring: 'not an object' } };
    const data = { key: 'value' };

    const result = setPluginStatus({
      resultDestinationPath,
      context,
      data,
      status: ProcessStatus.SUCCESS,
      ignoreLastKey: true,
    });

    expect(result).toEqual({
      apiPlugins: {
        merchantMonitoring: { key: 'value' },
      },
    });
  });

  it('should use default ignoreLastKey value when not provided', () => {
    const resultDestinationPath = 'apiPlugins.merchantMonitoring.data';
    const context = {
      apiPlugins: {
        merchantMonitoring: {
          data: { key: 'value' },
          status: ProcessStatus.IN_PROGRESS,
        },
      },
    };
    const data = { key: 'value' };

    const result = setPluginStatus({
      resultDestinationPath,
      context,
      data,
      status: ProcessStatus.SUCCESS,
    });

    expect(result).toEqual({
      apiPlugins: {
        merchantMonitoring: {
          data: { key: 'value' },
          status: ProcessStatus.SUCCESS,
        },
      },
    });
  });
});

describe('HookCallbackHandlerService', () => {
  it('handles missing business in website-monitoring callback without throwing', async () => {
    const businessService = {
      getByCorrelationId: jest.fn().mockResolvedValue(null),
    };

    const service = new HookCallbackHandlerService(
      {} as never,
      {} as never,
      businessService as never,
      {} as never,
      {} as never,
    );

    const result = await service.prepareWebsiteMonitoringContext(
      { reportData: { monitored: true } },
      {
        context: {
          entity: { id: 'corr-123' },
          apiPlugins: {
            websiteMonitoring: {
              status: ProcessStatus.IN_PROGRESS,
            },
          },
        },
      } as unknown as WorkflowRuntimeData,
      'apiPlugins.websiteMonitoring',
      'project-id',
    );

    expect(result).toEqual({
      apiPlugins: {
        websiteMonitoring: {
          data: { monitored: true },
          status: ProcessStatus.SUCCESS,
        },
      },
    });
    expect(businessService.getByCorrelationId).toHaveBeenCalledWith('corr-123', ['project-id']);
  });
});
