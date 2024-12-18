import { createTestId } from '@/components/organisms/Renderer';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useElement, useField } from '../../hooks/external';
import { IFormElement } from '../../types';
import { useStack } from '../FieldList/providers/StackProvider';
import { FileField, IFileFieldParams } from './FileField';

vi.mock('../FieldList/providers/StackProvider');
vi.mock('../../hooks/external');
vi.mock('@/components/organisms/Renderer');

const mockUseStack = vi.mocked(useStack);
const mockUseElement = vi.mocked(useElement);
const mockUseField = vi.mocked(useField);
const mockCreateTestId = vi.mocked(createTestId);

describe('FileField', () => {
  const mockElement = {
    id: 'test-file',
    params: {
      placeholder: 'Test Placeholder',
      acceptFileFormats: '.pdf,.doc',
    },
  } as IFormElement<string, IFileFieldParams>;

  const mockOnChange = vi.fn();
  const mockOnBlur = vi.fn();
  const mockOnFocus = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseStack.mockReturnValue({ stack: [] });
    mockUseElement.mockReturnValue({ id: 'test-id' } as ReturnType<typeof useElement>);
    mockUseField.mockReturnValue({
      value: undefined,
      touched: false,
      disabled: false,
      onChange: mockOnChange,
      onBlur: mockOnBlur,
      onFocus: mockOnFocus,
    });
    mockCreateTestId.mockReturnValue('test-file-field');
  });

  it('renders with default state', () => {
    render(<FileField element={mockElement} />);

    expect(screen.getByText('Test Placeholder')).toBeInTheDocument();
    expect(screen.getByText('No File Choosen')).toBeInTheDocument();
  });

  it('handles file selection', () => {
    render(<FileField element={mockElement} />);

    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
    const input = screen.getByTestId('test-file-field-hidden-input');

    fireEvent.change(input, { target: { files: [file] } });

    expect(mockOnChange).toHaveBeenCalledWith(file);
  });

  it('displays file name when file is selected', () => {
    mockUseField.mockReturnValue({
      value: new File(['test'], 'test.pdf'),
      touched: false,
      disabled: false,
      onChange: mockOnChange,
      onBlur: mockOnBlur,
      onFocus: mockOnFocus,
    } as ReturnType<typeof useField>);

    render(<FileField element={mockElement} />);

    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });

  it('handles file removal', () => {
    mockUseField.mockReturnValue({
      value: new File(['test'], 'test.pdf'),
      touched: false,
      disabled: false,
      onChange: mockOnChange,
      onBlur: mockOnBlur,
      onFocus: mockOnFocus,
    } as ReturnType<typeof useField>);

    render(<FileField element={mockElement} />);

    const removeButton = screen.getByRole('button');
    fireEvent.click(removeButton);

    expect(mockOnChange).toHaveBeenCalledWith(undefined);
  });

  it('applies disabled state correctly', () => {
    mockUseField.mockReturnValue({
      value: undefined,
      disabled: true,
      onChange: mockOnChange,
      onBlur: mockOnBlur,
      onFocus: mockOnFocus,
      touched: false,
    } as ReturnType<typeof useField>);

    render(<FileField element={mockElement} />);

    const container = screen.getByTestId('test-file-field');
    expect(container).toHaveClass('pointer-events-none opacity-50');
  });

  it('handles string value by creating a File object', () => {
    mockUseField.mockReturnValue({
      value: 'test-file.pdf',
      disabled: false,
      onChange: mockOnChange,
      onBlur: mockOnBlur,
      onFocus: mockOnFocus,
      touched: false,
    } as ReturnType<typeof useField>);

    render(<FileField element={mockElement} />);

    expect(screen.getByText('test-file.pdf')).toBeInTheDocument();
  });

  it('triggers focus and blur events', () => {
    render(<FileField element={mockElement} />);

    const input = screen.getByTestId('test-file-field-hidden-input');

    fireEvent.focus(input);
    expect(mockOnFocus).toHaveBeenCalled();

    fireEvent.blur(input);
    expect(mockOnBlur).toHaveBeenCalled();
  });
});
