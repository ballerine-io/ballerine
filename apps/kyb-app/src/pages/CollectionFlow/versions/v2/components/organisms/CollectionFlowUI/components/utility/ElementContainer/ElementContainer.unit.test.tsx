import { IFormElement, TDeepthLevelStack, useElement } from '@ballerine/ui';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ElementContainer } from './ElementContainer';

vi.mock('@ballerine/ui', () => ({
  useElement: vi.fn(),
}));

describe('ElementContainer', () => {
  const mockElement = {
    id: 'test-id',
    element: 'test',
  } as IFormElement<any, any>;

  const mockStack = {} as TDeepthLevelStack;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when not hidden', () => {
    vi.mocked(useElement).mockReturnValue({
      hidden: false,
      id: 'test-id',
      originId: 'test-origin-id',
    });

    const { container } = render(
      <ElementContainer element={mockElement} stack={mockStack}>
        <div>Test Content</div>
      </ElementContainer>,
    );

    expect(container).toHaveTextContent('Test Content');
    expect(useElement).toHaveBeenCalledWith(mockElement, mockStack);
  });

  it('does not render children when hidden', () => {
    vi.mocked(useElement).mockReturnValue({
      hidden: true,
      id: 'test-id',
      originId: 'test-origin-id',
    });

    const { container } = render(
      <ElementContainer element={mockElement} stack={mockStack}>
        <div>Test Content</div>
      </ElementContainer>,
    );

    expect(container).toBeEmptyDOMElement();
    expect(useElement).toHaveBeenCalledWith(mockElement, mockStack);
  });

  it('calls useElement with correct props', () => {
    vi.mocked(useElement).mockReturnValue({
      hidden: false,
      id: 'test-id',
      originId: 'test-origin-id',
    });

    render(
      <ElementContainer element={mockElement} stack={mockStack}>
        <div>Test Content</div>
      </ElementContainer>,
    );

    expect(useElement).toHaveBeenCalledWith(mockElement, mockStack);
    expect(useElement).toHaveBeenCalledTimes(1);
  });

  it('works without stack prop', () => {
    vi.mocked(useElement).mockReturnValue({
      hidden: false,
      id: 'test-id',
      originId: 'test-origin-id',
    });

    const { container } = render(
      <ElementContainer element={mockElement}>
        <div>Test Content</div>
      </ElementContainer>,
    );

    expect(container).toHaveTextContent('Test Content');
    expect(useElement).toHaveBeenCalledWith(mockElement, undefined);
  });
});
