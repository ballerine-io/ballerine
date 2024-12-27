import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IFormElement } from '../../types';
import { FieldDescription } from './FieldDescription';

describe('FieldDescription', () => {
  const mockElement = {
    id: 'test-field',
    params: {
      description: 'Test description',
    },
  } as unknown as IFormElement;

  it('should render description text when description is provided', () => {
    render(<FieldDescription element={mockElement} />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
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
  });

  it('should not render anything when params is undefined', () => {
    const elementWithoutParams = {
      id: 'test-field',
    } as unknown as IFormElement;

    render(<FieldDescription element={elementWithoutParams} />);
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument();
  });
});
