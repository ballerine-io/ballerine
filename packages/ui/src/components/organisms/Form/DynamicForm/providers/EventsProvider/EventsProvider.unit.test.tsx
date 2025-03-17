import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IFormEventElement, TElementEvent } from '../../hooks/internal/useEvents/types';
import { EventsProvider } from './EventsProvider';
import { useEventsPool } from './hooks/internal/useEventsPool';

vi.mock('./hooks/internal/useEventsPool', () => ({
  useEventsPool: vi.fn(),
}));

describe('EventsProvider', () => {
  const mockContext = {
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
    run: vi.fn(),
    event: vi.fn(),
    listeners: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useEventsPool).mockReturnValue(mockContext);
  });

  it('should render children', () => {
    const { getByText } = render(
      <EventsProvider>
        <div>Test Child</div>
      </EventsProvider>,
    );

    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('should call useEventsPool with onEvent prop', () => {
    const mockOnEvent = vi.fn();
    render(<EventsProvider onEvent={mockOnEvent}>Child</EventsProvider>);

    expect(useEventsPool).toHaveBeenCalledWith(mockOnEvent);
  });

  it('should provide context value from useEventsPool', () => {
    const mockOnEvent = (eventName: TElementEvent, element: IFormEventElement<string, any>) => {
      console.log(eventName, element);
    };
    render(
      <EventsProvider onEvent={mockOnEvent}>
        <div>Child</div>
      </EventsProvider>,
    );

    expect(useEventsPool).toHaveBeenCalledWith(mockOnEvent);
  });

  it('should work without onEvent prop', () => {
    render(
      <EventsProvider>
        <div>Child</div>
      </EventsProvider>,
    );

    expect(useEventsPool).toHaveBeenCalledWith(undefined);
  });
});
