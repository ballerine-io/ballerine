import { TagsInput } from '@/components/molecules';
import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TDeepthLevelStack } from '../../../Validator';
import { useElement, useField } from '../../hooks/external';
import { usePriorityFields } from '../../hooks/internal/usePriorityFields';
import { FieldDescription } from '../../layouts/FieldDescription';
import { IFormElement } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';
import { TagsField } from './TagsField';

vi.mock('@/components/molecules', () => ({
  TagsInput: vi.fn(props => (
    <input
      type="text"
      value={props.value?.join(', ') || ''}
      onChange={e => props.onChange?.(e.target.value.split(', '))}
      onBlur={props.onBlur}
      onFocus={props.onFocus}
      disabled={props.disabled}
      data-testid={props.testId}
    />
  )),
}));

vi.mock('../../hooks/external', () => ({
  useField: vi.fn(),
  useElement: vi.fn(),
}));

vi.mock('../FieldList/providers/StackProvider', () => ({
  useStack: vi.fn(),
}));

vi.mock('../../layouts/FieldDescription', () => ({
  FieldDescription: vi.fn(),
}));

vi.mock('../../hooks/internal/usePriorityFields', () => ({
  usePriorityFields: vi.fn(),
}));

describe('TagsField', () => {
  const mockElement = {
    id: 'test-tags',
    element: 'tagsfield',
    valueDestination: 'tags',
    params: {
      label: 'Test Tags',
    },
  } as unknown as IFormElement;

  const mockStack = [] as unknown as TDeepthLevelStack;
  const mockFieldProps = {
    value: ['tag1', 'tag2'],
    onChange: vi.fn(),
    onBlur: vi.fn(),
    onFocus: vi.fn(),
    disabled: false,
    touched: false,
  };

  beforeEach(() => {
    vi.mocked(useStack).mockReturnValue({ stack: mockStack });
    vi.mocked(useField).mockReturnValue(mockFieldProps);
    vi.mocked(useElement).mockReturnValue({
      id: 'test-tags',
      originId: 'test-tags',
      hidden: false,
    });
    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: undefined,
      isPriorityField: false,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders TagsInput with correct props', () => {
    render(<TagsField element={mockElement} />);

    expect(TagsInput).toHaveBeenCalledWith(
      expect.objectContaining({
        value: mockFieldProps.value,
        testId: `test-tags`,
        onChange: mockFieldProps.onChange,
        onBlur: mockFieldProps.onBlur,
        onFocus: mockFieldProps.onFocus,
        disabled: mockFieldProps.disabled,
      }),
      expect.anything(),
    );
  });

  it('passes undefined value correctly', () => {
    vi.mocked(useField).mockReturnValue({
      ...mockFieldProps,
      value: undefined,
    });

    render(<TagsField element={mockElement} />);

    expect(TagsInput).toHaveBeenCalledWith(
      expect.objectContaining({
        value: undefined,
      }),
      expect.anything(),
    );
  });

  it('handles disabled state', () => {
    vi.mocked(useField).mockReturnValue({
      ...mockFieldProps,
      disabled: true,
    });

    render(<TagsField element={mockElement} />);

    expect(TagsInput).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
      }),
      expect.anything(),
    );
  });

  it('renders FieldDescription with element prop', () => {
    render(<TagsField element={mockElement} />);

    expect(FieldDescription).toHaveBeenCalledWith(
      expect.objectContaining({
        element: mockElement,
      }),
      expect.any(Object),
    );
  });

  it('renders priority reason when priorityField exists', () => {
    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: {
        id: 'test-id',
        reason: 'This is a priority field',
      },
      isPriorityField: true,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });

    render(<TagsField element={mockElement} />);

    expect(screen.getByText('This is a priority field')).toBeInTheDocument();
  });

  it('does not render priority reason when priorityField is undefined', () => {
    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: undefined,
      isPriorityField: false,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });

    render(<TagsField element={mockElement} />);

    expect(screen.queryByText('This is a priority field')).not.toBeInTheDocument();
  });
});
