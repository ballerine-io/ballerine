import { IFormElement, createTestId } from '@ballerine/ui';
import { render, screen } from '@testing-library/react';
import DOMPurify from 'dompurify';
import { describe, expect, it, vi } from 'vitest';
import { ElementContainer } from '../../utility/ElementContainer';
import {
  DESCRIPTION_UI_ELEMENT_TYPE,
  DescriptionElement,
  IDescriptionElementParams,
} from './DescriptionElement';

vi.mock('@ballerine/ui', () => ({
  createTestId: vi.fn(),
}));

vi.mock('../../utility/ElementContainer', () => ({
  ElementContainer: vi.fn(),
}));

vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn(),
  },
}));

describe('DescriptionElement', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ElementContainer).mockImplementation(({ children }) => children);
    vi.mocked(DOMPurify.sanitize).mockImplementation(str => str as string);
    vi.mocked(createTestId).mockImplementation(element => `test-id-${element.id}`);
  });

  it('renders within ElementContainer', () => {
    const element = {
      element: DESCRIPTION_UI_ELEMENT_TYPE,
      params: {
        descriptionRaw: 'Test Description',
      },
    } as IFormElement<typeof DESCRIPTION_UI_ELEMENT_TYPE, IDescriptionElementParams>;

    render(<DescriptionElement element={element} />);

    expect(ElementContainer).toHaveBeenCalled();
  });

  it('renders description text correctly', () => {
    const element = {
      element: DESCRIPTION_UI_ELEMENT_TYPE,
      params: {
        descriptionRaw: 'Test Description',
      },
    } as IFormElement<typeof DESCRIPTION_UI_ELEMENT_TYPE, IDescriptionElementParams>;

    render(<DescriptionElement element={element} />);

    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toHaveClass(
      'font-inter pb-2 text-sm text-slate-500',
    );
  });

  it('sanitizes HTML content', () => {
    const element = {
      element: DESCRIPTION_UI_ELEMENT_TYPE,
      params: {
        descriptionRaw: '<p>Test Description</p>',
      },
    } as IFormElement<typeof DESCRIPTION_UI_ELEMENT_TYPE, IDescriptionElementParams>;

    render(<DescriptionElement element={element} />);

    expect(DOMPurify.sanitize).toHaveBeenCalledWith('<p>Test Description</p>');
  });

  it('does not render when descriptionRaw is empty', () => {
    const element = {
      element: DESCRIPTION_UI_ELEMENT_TYPE,
      params: {
        descriptionRaw: '',
      },
    } as IFormElement<typeof DESCRIPTION_UI_ELEMENT_TYPE, IDescriptionElementParams>;

    const { container } = render(<DescriptionElement element={element} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('does not render when params is undefined', () => {
    const element = {
      element: DESCRIPTION_UI_ELEMENT_TYPE,
      params: undefined,
    } as IFormElement<typeof DESCRIPTION_UI_ELEMENT_TYPE, IDescriptionElementParams>;

    const { container } = render(<DescriptionElement element={element} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('logs warning when descriptionRaw is empty', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => null);
    const element = {
      id: 'test-id',
      element: DESCRIPTION_UI_ELEMENT_TYPE,
      params: {
        descriptionRaw: '',
      },
    } as IFormElement<typeof DESCRIPTION_UI_ELEMENT_TYPE, IDescriptionElementParams>;

    render(<DescriptionElement element={element} />);

    expect(consoleSpy).toHaveBeenCalledWith(
      'description - ID:test-id element has no description, element will not be rendered.',
    );
    consoleSpy.mockRestore();
  });

  it('applies test-id to the description element', () => {
    const element = {
      id: 'description-1',
      element: DESCRIPTION_UI_ELEMENT_TYPE,
      params: {
        descriptionRaw: 'Test Description',
      },
    } as IFormElement<typeof DESCRIPTION_UI_ELEMENT_TYPE, IDescriptionElementParams>;

    render(<DescriptionElement element={element} />);

    expect(createTestId).toHaveBeenCalledWith(element);
    expect(screen.getByTestId('test-id-description-1')).toBeInTheDocument();
  });
});
