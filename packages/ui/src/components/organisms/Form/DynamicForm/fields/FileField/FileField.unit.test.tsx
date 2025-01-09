import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useField } from '../../hooks/external';
import { useMountEvent } from '../../hooks/internal/useMountEvent';
import { usePriorityFields } from '../../hooks/internal/usePriorityFields';
import { useUnmountEvent } from '../../hooks/internal/useUnmountEvent';
import { IFormElement } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';
import { FileField, IFileFieldParams } from './FileField';
import { useFileUpload } from './hooks/useFileUpload';

vi.mock('../../hooks/external');
vi.mock('../../hooks/internal/useMountEvent');
vi.mock('../../hooks/internal/useUnmountEvent');
vi.mock('../../hooks/internal/usePriorityFields');
vi.mock('../FieldList/providers/StackProvider');
vi.mock('./hooks/useFileUpload');
vi.mock('@/components/atoms', () => ({
  Button: vi.fn(({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  )),
  Input: vi.fn(({ ...props }, ref) => <input {...props} ref={ref} />),
}));
vi.mock('../../layouts/FieldLayout', () => ({
  FieldLayout: vi.fn(({ children }) => <div data-testid="field-layout">{children}</div>),
}));
vi.mock('../../layouts/FieldErrors', () => ({
  FieldErrors: vi.fn(({ element }) => <div data-testid="field-errors">{element.id}</div>),
}));
vi.mock('../../layouts/FieldDescription', () => ({
  FieldDescription: vi.fn(({ element }) => <div data-testid="field-description">{element.id}</div>),
}));

describe('FileField', () => {
  const mockElement = {
    id: 'test-file',
    params: {
      placeholder: 'Test Placeholder',
      acceptFileFormats: '.jpg,.png',
    },
  } as IFormElement<string, IFileFieldParams>;

  const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });

  beforeEach(() => {
    vi.mocked(useStack).mockReturnValue({
      stack: [],
    });

    vi.mocked(useField).mockReturnValue({
      value: undefined,
      disabled: false,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      touched: false,
    });

    vi.mocked(useFileUpload).mockReturnValue({
      handleChange: vi.fn(),
      isUploading: false,
    });

    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: undefined,
      isPriorityField: false,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<FileField element={mockElement} />);

    expect(screen.getByText('Test Placeholder')).toBeInTheDocument();
    expect(screen.getByText('No File Choosen')).toBeInTheDocument();
  });

  it('shows file name when file is selected', () => {
    vi.mocked(useField).mockReturnValue({
      value: mockFile,
      disabled: false,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      touched: false,
    });

    render(<FileField element={mockElement} />);

    expect(screen.getByText('test.txt')).toBeInTheDocument();
  });

  it('shows clear button when file is selected', () => {
    const mockOnChange = vi.fn();
    vi.mocked(useField).mockReturnValue({
      value: mockFile,
      disabled: false,
      onChange: mockOnChange,
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      touched: false,
    });

    render(<FileField element={mockElement} />);

    const clearButton = screen.getByRole('button');
    expect(clearButton).toBeInTheDocument();
  });

  it('clears file when clear button is clicked', async () => {
    const mockOnChange = vi.fn();
    vi.mocked(useField).mockReturnValue({
      value: mockFile,
      disabled: false,
      onChange: mockOnChange,
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      touched: false,
    });

    render(<FileField element={mockElement} />);

    const clearButton = screen.getByRole('button');
    await userEvent.click(clearButton);

    expect(mockOnChange).toHaveBeenCalledWith(undefined);
  });

  it('disables input when field is disabled', () => {
    vi.mocked(useField).mockReturnValue({
      value: undefined,
      disabled: true,
      onChange: vi.fn(),
      onBlur: vi.fn(),
      onFocus: vi.fn(),
      touched: false,
    });

    render(<FileField element={mockElement} />);

    const container = screen.getByTestId('test-file');
    expect(container.className).toContain('pointer-events-none');
  });

  it('disables input while uploading', () => {
    vi.mocked(useFileUpload).mockReturnValue({
      handleChange: vi.fn(),
      isUploading: true,
    });

    render(<FileField element={mockElement} />);

    const container = screen.getByTestId('test-file');
    expect(container.className).toContain('pointer-events-none');
  });

  it('calls mount and unmount events', () => {
    render(<FileField element={mockElement} />);

    expect(useMountEvent).toHaveBeenCalledWith(mockElement);
    expect(useUnmountEvent).toHaveBeenCalledWith(mockElement);
  });

  it('renders field description with element prop', () => {
    render(<FileField element={mockElement} />);
    const description = screen.getByTestId('field-description');
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent(mockElement.id);
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

    render(<FileField element={mockElement} />);

    expect(screen.getByText('This is a priority field')).toBeInTheDocument();
  });

  it('does not render priority reason when priorityField is undefined', () => {
    vi.mocked(usePriorityFields).mockReturnValue({
      priorityField: undefined,
      isPriorityField: false,
      isShouldDisablePriorityField: false,
      isShouldHidePriorityField: false,
    });

    render(<FileField element={mockElement} />);

    expect(screen.queryByText('This is a priority field')).not.toBeInTheDocument();
  });
});
