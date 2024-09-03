import { setPluginStatus } from './hook-callback-handler.service';
import { ProcessStatus } from '@ballerine/common';

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
