import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useRequired } from '../../hooks/external/useRequired';
import { IFormElement } from '../../types';
import { FieldLayout } from './FieldLayout';

// Mock dependencies
vi.mock('@ballerine/ui', () => ({
  ctw: vi.fn((base, conditionals) => base),
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}));

vi.mock('../../context', () => ({
  useDynamicForm: vi.fn(() => ({ values: {} })),
}));

vi.mock('../../fields/FieldList/providers/StackProvider', () => ({
  useStack: vi.fn(() => ({ stack: [] })),
}));

vi.mock('../../hooks/external', () => ({
  useElement: vi.fn(element => ({ id: element.id })),
}));

vi.mock('../../hooks/external/useRequired', () => ({
  useRequired: vi.fn(),
}));

describe('FieldLayout', () => {
  const mockElement = {
    id: 'test-field',
    params: {
      label: 'Test Label',
    },
  } as unknown as IFormElement;

  it('should render children', () => {
    vi.mocked(useRequired).mockReturnValue(false);

    render(
      <FieldLayout element={mockElement}>
        <div data-testid="child">Child Content</div>
      </FieldLayout>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('should render with correct data-testid', () => {
    vi.mocked(useRequired).mockReturnValue(false);

    render(<FieldLayout element={mockElement} />);

    expect(screen.getByTestId('test-field-field-layout')).toBeInTheDocument();
  });

  it('should not render label when label prop is not provided', () => {
    vi.mocked(useRequired).mockReturnValue(false);

    const elementWithoutLabel = {
      id: 'test-field',
      params: {},
    } as unknown as IFormElement;

    render(<FieldLayout element={elementWithoutLabel} />);

    expect(screen.queryByText(/Test Label/)).not.toBeInTheDocument();
  });

  it('should render required label when field is required', () => {
    vi.mocked(useRequired).mockReturnValue(true);

    render(<FieldLayout element={mockElement} />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should render optional label when field is not required', () => {
    vi.mocked(useRequired).mockReturnValue(false);

    render(<FieldLayout element={mockElement} />);

    expect(screen.getByText('Test Label (optional)')).toBeInTheDocument();
  });

  it('should render label with correct htmlFor attribute', () => {
    vi.mocked(useRequired).mockReturnValue(false);

    render(<FieldLayout element={mockElement} />);

    const label = screen.getByText('Test Label (optional)');
    expect(label).toHaveAttribute('for', 'test-field-label');
  });

  it('should render label with correct id attribute', () => {
    vi.mocked(useRequired).mockReturnValue(false);

    render(<FieldLayout element={mockElement} />);

    const label = screen.getByText('Test Label (optional)');
    expect(label).toHaveAttribute('id', 'test-field-label');
  });
});
