import { IFormElement, createTestId } from '@ballerine/ui';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ElementContainer } from '../../utility/ElementContainer';
import { DIVIDER_UI_ELEMENT_TYPE, DividerElement } from './DividerElement';

vi.mock('@ballerine/ui', () => ({
  createTestId: vi.fn(),
}));

vi.mock('../../utility/ElementContainer', () => ({
  ElementContainer: vi.fn(),
}));

describe('DividerElement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ElementContainer).mockImplementation(({ children }) => children);
    vi.mocked(createTestId).mockImplementation(element => `test-id-${element.id}`);
  });

  it('renders within ElementContainer', () => {
    const element = {
      element: DIVIDER_UI_ELEMENT_TYPE,
    } as IFormElement<typeof DIVIDER_UI_ELEMENT_TYPE>;

    render(<DividerElement element={element} />);

    expect(ElementContainer).toHaveBeenCalled();
  });

  it('renders divider with correct styling', () => {
    const element = {
      element: DIVIDER_UI_ELEMENT_TYPE,
    } as IFormElement<typeof DIVIDER_UI_ELEMENT_TYPE>;

    render(<DividerElement element={element} />);

    const divider = screen.getByTestId('test-id-undefined');
    expect(divider).toBeInTheDocument();
    expect(divider).toHaveClass('my-3', 'h-[1px]', 'w-full', 'bg-[#CECECE]');
  });

  it('applies test-id to the divider element', () => {
    const element = {
      id: 'divider-1',
      element: DIVIDER_UI_ELEMENT_TYPE,
    } as IFormElement<typeof DIVIDER_UI_ELEMENT_TYPE>;

    render(<DividerElement element={element} />);

    expect(createTestId).toHaveBeenCalledWith(element);
    expect(screen.getByTestId('test-id-divider-1')).toBeInTheDocument();
  });
});
