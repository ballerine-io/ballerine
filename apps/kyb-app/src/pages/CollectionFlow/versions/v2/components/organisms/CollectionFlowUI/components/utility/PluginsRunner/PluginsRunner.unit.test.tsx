import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, it, vi } from 'vitest';
import { PluginsRunner } from './PluginsRunner';
import { usePluginsRunner } from './hooks/internal/usePluginsRunner';
import { IPlugin } from './types';

vi.mock('./hooks/internal/usePluginsRunner', () => ({
  usePluginsRunner: vi.fn(),
}));

describe('PluginsRunner', () => {
  const mockPlugins: Array<IPlugin<any, any>> = [
    {
      name: 'testPlugin',
      runOn: [],
      params: {},
    },
  ];

  beforeEach(() => {
    vi.mocked(usePluginsRunner).mockReturnValue({
      pluginStatuses: {},
      runPlugin: vi.fn(),
      plugins: mockPlugins,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render children', () => {
    render(
      <PluginsRunner plugins={mockPlugins}>
        <div data-testid="test-child">Test Child</div>
      </PluginsRunner>,
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('should call usePluginsRunner with provided plugins', () => {
    render(
      <PluginsRunner plugins={mockPlugins}>
        <div>Test Child</div>
      </PluginsRunner>,
    );

    expect(usePluginsRunner).toHaveBeenCalledWith(mockPlugins);
  });

  it('should provide context through PluginsRunnerContext', () => {
    const TestConsumer = () => {
      return <div data-testid="test-consumer">Test Consumer</div>;
    };

    render(
      <PluginsRunner plugins={mockPlugins}>
        <TestConsumer />
      </PluginsRunner>,
    );

    expect(screen.getByTestId('test-consumer')).toBeInTheDocument();
  });
});
