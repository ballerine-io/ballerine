import { createTestId, IFormElement } from '@ballerine/ui';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ElementContainer } from '../../utility/ElementContainer';
import { H1_UI_ELEMENT_TYPE, H1Element, IH1ElementParams } from './H1Element';

vi.mock('@ballerine/ui', () => ({
  createTestId: vi.fn(),
}));

vi.mock('../../utility/ElementContainer', () => ({
  ElementContainer: vi.fn(),
}));

describe('H1Element', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(createTestId).mockReturnValue('test-id');
    vi.mocked(ElementContainer).mockImplementation(({ children }) => children);
  });

  it('renders within ElementContainer', () => {
    const element = {
      element: H1_UI_ELEMENT_TYPE,
      params: {
        text: 'Test Heading',
      },
    } as IFormElement<typeof H1_UI_ELEMENT_TYPE, IH1ElementParams>;

    render(<H1Element element={element} />);

    expect(ElementContainer).toHaveBeenCalled();
  });

  it('renders heading text correctly', () => {
    const element = {
      element: H1_UI_ELEMENT_TYPE,
      params: {
        text: 'Test Heading',
      },
    } as IFormElement<typeof H1_UI_ELEMENT_TYPE, IH1ElementParams>;

    render(<H1Element element={element} />);

    expect(screen.getByText('Test Heading')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveClass('pb-6 pt-4 text-3xl font-bold');
    expect(screen.getByTestId('test-id')).toBeInTheDocument();
  });

  it('does not render when text is empty', () => {
    const element = {
      element: H1_UI_ELEMENT_TYPE,
      params: {
        text: '',
      },
    } as IFormElement<typeof H1_UI_ELEMENT_TYPE, IH1ElementParams>;

    const { container } = render(<H1Element element={element} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('does not render when params is undefined', () => {
    const element = {
      element: H1_UI_ELEMENT_TYPE,
      params: undefined,
    } as IFormElement<typeof H1_UI_ELEMENT_TYPE, IH1ElementParams>;

    const { container } = render(<H1Element element={element} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('logs warning when text is empty', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => null);
    const element = {
      id: 'test-id',
      element: H1_UI_ELEMENT_TYPE,
      params: {
        text: '',
      },
    } as IFormElement<typeof H1_UI_ELEMENT_TYPE, IH1ElementParams>;

    render(<H1Element element={element} />);

    expect(consoleSpy).toHaveBeenCalledWith(
      'h1 - ID:test-id element has no text, element will not be rendered.',
    );
    consoleSpy.mockRestore();
  });
});
