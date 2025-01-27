import { createTestId, IFormElement } from '@ballerine/ui';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ElementContainer } from '../../utility/ElementContainer';
import { H3_UI_ELEMENT_TYPE, H3Element, IH3ElementParams } from './H3Element';

vi.mock('@ballerine/ui', () => ({
  createTestId: vi.fn(),
}));

vi.mock('../../utility/ElementContainer', () => ({
  ElementContainer: vi.fn(),
}));

describe('H3Element', () => {
  beforeEach(() => {
    vi.mocked(createTestId).mockReturnValue('test-id');
    vi.mocked(ElementContainer).mockImplementation(({ children }) => children);
  });

  it('renders within ElementContainer', () => {
    const element = {
      element: H3_UI_ELEMENT_TYPE,
      params: {
        text: 'Test Heading',
      },
    } as IFormElement<typeof H3_UI_ELEMENT_TYPE, IH3ElementParams>;

    render(<H3Element element={element} />);
    expect(ElementContainer).toHaveBeenCalled();
  });

  it('renders heading text correctly', () => {
    const element = {
      element: H3_UI_ELEMENT_TYPE,
      params: {
        text: 'Test Heading',
      },
    } as IFormElement<typeof H3_UI_ELEMENT_TYPE, IH3ElementParams>;

    render(<H3Element element={element} />);

    expect(screen.getByText('Test Heading')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3 })).toHaveClass('pt-4 text-xl font-bold');
    expect(screen.getByTestId('test-id')).toBeInTheDocument();
  });

  it('does not render when text is empty', () => {
    const element = {
      element: H3_UI_ELEMENT_TYPE,
      params: {
        text: '',
      },
    } as IFormElement<typeof H3_UI_ELEMENT_TYPE, IH3ElementParams>;

    const { container } = render(<H3Element element={element} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('does not render when params is undefined', () => {
    const element = {
      element: H3_UI_ELEMENT_TYPE,
      params: undefined,
    } as IFormElement<typeof H3_UI_ELEMENT_TYPE, IH3ElementParams>;

    const { container } = render(<H3Element element={element} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('logs warning when text is empty', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => null);
    const element = {
      id: 'test-id',
      element: H3_UI_ELEMENT_TYPE,
      params: {
        text: '',
      },
    } as IFormElement<typeof H3_UI_ELEMENT_TYPE, IH3ElementParams>;

    render(<H3Element element={element} />);

    expect(consoleSpy).toHaveBeenCalledWith(
      'h3 - ID:test-id element has no text, element will not be rendered.',
    );
    consoleSpy.mockRestore();
  });
});
