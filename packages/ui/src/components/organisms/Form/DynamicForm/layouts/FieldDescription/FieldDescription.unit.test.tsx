import { render, screen } from '@testing-library/react';
import DOMPurify from 'dompurify';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FieldDescription } from './FieldDescription';
import { TUIElement } from '@ballerine/common';

vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn(input => input),
  },
}));

describe('FieldDescription', () => {
  const mockElement: TUIElement = {
    id: 'test-field',
    element: 'textfield',
    params: {},
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render description text when description is provided', () => {
    render(<FieldDescription element={mockElement} />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(DOMPurify.sanitize).toHaveBeenCalledWith('Test description');
  });

  it('should apply correct styling classes', () => {
    render(<FieldDescription element={mockElement} />);
    const description = screen.getByText('Test description');
    expect(description).toHaveClass('text-sm', 'text-gray-400');
  });

  it('should not render anything when description is not provided', () => {
    const elementWithoutDescription = {
      id: 'test-field',
      element: 'textfield',
      params: {},
    } as unknown as TUIElement;

    render(<FieldDescription element={elementWithoutDescription} />);
    expect(screen.queryByText(/Test description/)).not.toBeInTheDocument();
    expect(DOMPurify.sanitize).not.toHaveBeenCalled();
  });

  it('should not render anything when params is undefined', () => {
    const elementWithoutParams = {
      id: 'test-field',
      element: 'textfield',
    } as unknown as TUIElement;

    render(<FieldDescription element={elementWithoutParams} />);
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
    expect(DOMPurify.sanitize).not.toHaveBeenCalled();
  });

  it('should sanitize HTML in description', () => {
    const elementWithHtml = {
      id: 'test-field',
      element: 'textfield',
      params: {
        description: '<script>alert("xss")</script><p>Safe text</p>',
      },
    } as unknown as TUIElement;

    render(<FieldDescription element={elementWithHtml} />);
    expect(DOMPurify.sanitize).toHaveBeenCalledWith(
      '<script>alert("xss")</script><p>Safe text</p>',
    );
  });
});
