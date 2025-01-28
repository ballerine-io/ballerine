import { render, screen } from '@testing-library/react';
import DOMPurify from 'dompurify';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { IFormElement } from '../../types';
import { FieldDescription } from './FieldDescription';

vi.mock('dompurify', () => ({
  default: {
    sanitize: vi.fn(input => input),
  },
}));

describe('FieldDescription', () => {
  const mockElement = {
    id: 'test-field',
    params: {
      description: 'Test description',
    },
  } as unknown as IFormElement;

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
      params: {},
    } as unknown as IFormElement;

    render(<FieldDescription element={elementWithoutDescription} />);
    expect(screen.queryByText(/Test description/)).not.toBeInTheDocument();
    expect(DOMPurify.sanitize).not.toHaveBeenCalled();
  });

  it('should not render anything when params is undefined', () => {
    const elementWithoutParams = {
      id: 'test-field',
    } as unknown as IFormElement;

    render(<FieldDescription element={elementWithoutParams} />);
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
    expect(DOMPurify.sanitize).not.toHaveBeenCalled();
  });

  it('should sanitize HTML in description', () => {
    const elementWithHtml = {
      id: 'test-field',
      params: {
        description: '<script>alert("xss")</script><p>Safe text</p>',
      },
    } as unknown as IFormElement;

    render(<FieldDescription element={elementWithHtml} />);
    expect(DOMPurify.sanitize).toHaveBeenCalledWith(
      '<script>alert("xss")</script><p>Safe text</p>',
    );
  });
});
