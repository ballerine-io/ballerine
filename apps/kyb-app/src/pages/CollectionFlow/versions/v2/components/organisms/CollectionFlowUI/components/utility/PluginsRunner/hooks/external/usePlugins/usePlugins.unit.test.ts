import { useContext } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { PluginsRunnerContext } from '../../../context';
import { usePlugins } from './usePlugins';

vi.mock('react', () => ({
  createContext: vi.fn(),
  useContext: vi.fn(),
}));

describe('usePlugins', () => {
  it('should call useContext with PluginsRunnerContext', () => {
    const mockUseContext = vi.mocked(useContext);

    usePlugins();

    expect(mockUseContext).toHaveBeenCalledTimes(1);
    expect(mockUseContext).toHaveBeenCalledWith(PluginsRunnerContext);
  });

  it('should return the value from useContext', () => {
    const mockContextValue = { someValue: 'test' };
    const mockUseContext = vi.mocked(useContext);
    mockUseContext.mockReturnValue(mockContextValue);

    const result = usePlugins();

    expect(result).toBe(mockContextValue);
  });
});
