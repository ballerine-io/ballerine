import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IDynamicFormContext, useDynamicForm } from '../../context';
import { useStack } from '../../fields/FieldList/providers/StackProvider';
import { useElement } from '../../hooks/external';
import { useRequired } from '../../hooks/external/useRequired';
import { IFormElement } from '../../types';
import { FieldLayout } from './FieldLayout';

vi.mock('../../context');
vi.mock('../../fields/FieldList/providers/StackProvider');
vi.mock('../../hooks/external');
vi.mock('../../hooks/external/useRequired');

describe('FieldLayout', () => {
  const mockElement = {
    id: 'test',
    type: 'text',
    params: {
      label: 'Test Label',
    },
  } as unknown as IFormElement<string, any>;

  beforeEach(() => {
    vi.mocked(useDynamicForm).mockReturnValue({
      values: {},
    } as unknown as IDynamicFormContext<object>);
    vi.mocked(useStack).mockReturnValue({ stack: [] });
    vi.mocked(useElement).mockReturnValue({ id: 'test-id', originId: 'test-id', hidden: false });
    vi.mocked(useRequired).mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders children and label when provided', () => {
    render(
      <FieldLayout element={mockElement}>
        <div>Test Child</div>
      </FieldLayout>,
    );

    expect(screen.getByTestId('test-id-field-layout')).toBeInTheDocument();
    expect(screen.getByText('Test Label (optional)')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('renders required label when isRequired is true', () => {
    vi.mocked(useRequired).mockReturnValue(true);

    render(
      <FieldLayout element={mockElement}>
        <div>Test Child</div>
      </FieldLayout>,
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('does not render when hidden is true', () => {
    vi.mocked(useElement).mockReturnValue({ id: 'test-id', originId: 'test-id', hidden: true });

    render(
      <FieldLayout element={mockElement}>
        <div>Test Child</div>
      </FieldLayout>,
    );

    expect(screen.queryByTestId('test-id-field-layout')).not.toBeInTheDocument();
  });

  it('renders without label when not provided', () => {
    const elementWithoutLabel = {
      ...mockElement,
      params: {},
    };

    render(
      <FieldLayout element={elementWithoutLabel}>
        <div>Test Child</div>
      </FieldLayout>,
    );

    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('applies horizontal layout classes when specified', () => {
    render(
      <FieldLayout element={mockElement} layout="horizontal">
        <div>Test Child</div>
      </FieldLayout>,
    );

    const container = screen.getByTestId('test-id-field-layout').children[0];
    expect(container?.className).not.toContain('flex-col');
  });

  it('applies vertical layout classes by default', () => {
    render(
      <FieldLayout element={mockElement}>
        <div>Test Child</div>
      </FieldLayout>,
    );

    const container = screen.getByTestId('test-id-field-layout').children[0];
    expect(container?.className).toContain('flex-col');
  });
});
