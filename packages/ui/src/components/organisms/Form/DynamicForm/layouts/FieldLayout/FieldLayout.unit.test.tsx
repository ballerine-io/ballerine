import { cleanup, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useElement } from '../../hooks/external';
import { useRequired } from '../../hooks/external/useRequired';
import { IFormElement } from '../../types';
import { FieldLayout } from './FieldLayout';

// Mock dependencies
vi.mock('@/common', () => ({
  ctw: vi.fn((base, conditionals) => {
    if (conditionals) {
      return Object.entries(conditionals)
        .filter(([_, value]) => value)
        .map(([key]) => key)
        .concat(base)
        .join(' ');
    }

    return base;
  }),
}));

vi.mock('@/components/atoms', () => ({
  Label: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => (
    <label {...props}>{children}</label>
  ),
}));

vi.mock('../../context', () => ({
  useDynamicForm: vi.fn(() => ({ values: {} })),
}));

vi.mock('../../fields/FieldList/providers/StackProvider', () => ({
  useStack: vi.fn(() => ({ stack: [] })),
}));

vi.mock('../../hooks/external', () => ({
  useElement: vi.fn(element => ({ id: element.id, hidden: false })),
}));

vi.mock('../../hooks/external/useRequired', () => ({
  useRequired: vi.fn(),
}));

describe('FieldLayout', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

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

    render(
      <FieldLayout element={mockElement}>
        <div>Child Content</div>
      </FieldLayout>,
    );

    expect(screen.getByTestId('test-field-field-layout')).toBeInTheDocument();
  });

  it('should not render label when label prop is not provided', () => {
    vi.mocked(useRequired).mockReturnValue(false);

    const elementWithoutLabel = {
      id: 'test-field',
      params: {},
    } as unknown as IFormElement;

    render(
      <FieldLayout element={elementWithoutLabel}>
        <div>Child Content</div>
      </FieldLayout>,
    );

    expect(screen.queryByText(/Test Label/)).not.toBeInTheDocument();
  });

  it('should render required label when field is required', () => {
    vi.mocked(useRequired).mockReturnValue(true);

    render(
      <FieldLayout element={mockElement}>
        <div>Child Content</div>
      </FieldLayout>,
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('should render optional label when field is not required', () => {
    vi.mocked(useRequired).mockReturnValue(false);

    render(
      <FieldLayout element={mockElement}>
        <div>Child Content</div>
      </FieldLayout>,
    );

    expect(screen.getByText('Test Label (optional)')).toBeInTheDocument();
  });

  it('should render label with correct htmlFor attribute', () => {
    vi.mocked(useRequired).mockReturnValue(false);

    render(
      <FieldLayout element={mockElement}>
        <div>Child Content</div>
      </FieldLayout>,
    );

    const label = screen.getByText('Test Label (optional)');
    expect(label).toHaveAttribute('for', 'test-field');
  });

  it('should render label with correct id attribute', () => {
    vi.mocked(useRequired).mockReturnValue(false);

    render(
      <FieldLayout element={mockElement}>
        <div>Child Content</div>
      </FieldLayout>,
    );

    const label = screen.getByText('Test Label (optional)');
    expect(label).toHaveAttribute('id', 'test-field-label');
  });

  it('should not render anything when hidden is true', () => {
    vi.mocked(useElement).mockReturnValue({ id: 'test-field', hidden: true } as ReturnType<
      typeof useElement
    >);
    vi.mocked(useRequired).mockReturnValue(false);

    render(
      <FieldLayout element={mockElement}>
        <div>Child Content</div>
      </FieldLayout>,
    );

    expect(screen.queryByTestId('test-field-field-layout')).not.toBeInTheDocument();
  });

  it('should apply correct classes for vertical layout', () => {
    vi.mocked(useElement).mockReturnValue({ id: 'test-field', hidden: false } as ReturnType<
      typeof useElement
    >);
    vi.mocked(useRequired).mockReturnValue(false);

    render(
      <FieldLayout element={mockElement} layout="vertical">
        <div>Child Content</div>
      </FieldLayout>,
    );

    const container = screen.getByTestId('test-field-field-layout').children[0] as HTMLElement;
    expect(container.className).toContain('flex-col');
  });

  it('should apply correct classes for horizontal layout', () => {
    vi.mocked(useElement).mockReturnValue({ id: 'test-field', hidden: false } as ReturnType<
      typeof useElement
    >);
    vi.mocked(useRequired).mockReturnValue(false);

    render(
      <FieldLayout element={mockElement} layout="horizontal">
        <div>Child Content</div>
      </FieldLayout>,
    );

    const container = screen.getByTestId('test-field-field-layout').children[0] as HTMLElement;
    expect(container.className).toContain('flex-row');
    expect(container.className).toContain('items-center');
    expect(container.className).toContain('flex-row-reverse');
    expect(container.className).toContain('justify-end');
  });
});
