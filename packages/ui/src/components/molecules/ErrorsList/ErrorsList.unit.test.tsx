import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ErrorsList } from './ErrorsList';

// Mock ErrorMessage component
vi.mock('@/components/atoms', () => ({
  ErrorMessage: ({ text, className }: { text: string; className?: string }) => (
    <div className={className}>{text}</div>
  ),
}));

describe('ErrorsList', () => {
  it('renders empty list when no errors provided', () => {
    render(<ErrorsList errors={[]} />);
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('renders list of errors', () => {
    const errors = ['Error 1', 'Error 2', 'Error 3'];
    render(<ErrorsList errors={errors} />);

    errors.forEach(error => {
      expect(screen.getByText(error)).toBeInTheDocument();
    });
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('applies custom className when provided', () => {
    render(<ErrorsList errors={['Error']} className="custom-class" />);
    const list = screen.getByRole('list');
    expect(list.className).toContain('custom-class');
    expect(list.className).toContain('pl-1');
  });

  it('applies testId to list and list items when provided', () => {
    const errors = ['Error 1', 'Error 2'];
    render(<ErrorsList errors={errors} testId="test" />);

    expect(screen.getByTestId('test-errors-list')).toBeInTheDocument();
    expect(screen.getByTestId('test-error-list-item-0')).toBeInTheDocument();
    expect(screen.getByTestId('test-error-list-item-1')).toBeInTheDocument();
  });

  it('renders error type styling by default', () => {
    render(<ErrorsList errors={['Error']} />);
    // Default error type should not have warning class
    expect(screen.getByText('Error').className).not.toContain('text-amber-400');
  });

  it('renders warning type styling when specified', () => {
    render(<ErrorsList errors={['Warning']} type="warning" />);
    expect(screen.getByText('Warning').className).toContain('text-amber-400');
  });

  it('does not apply testId attributes when testId is not provided', () => {
    render(<ErrorsList errors={['Error']} />);
    expect(screen.queryByTestId(/errors-list/)).not.toBeInTheDocument();
    expect(screen.queryByTestId(/error-list-item-/)).not.toBeInTheDocument();
  });
});
