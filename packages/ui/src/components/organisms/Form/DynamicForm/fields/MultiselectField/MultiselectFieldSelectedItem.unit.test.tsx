import { MultiSelectOption } from '@/components/molecules';
import { SelectedElementParams } from '@/components/molecules/inputs/MultiSelect/types';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MultiselectfieldSelectedItem } from './MultiselectFieldSelectedItem';

describe('MultiselectfieldSelectedItem', () => {
  const mockOption: MultiSelectOption = {
    title: 'Test Option',
    value: 'test-value',
  };

  const mockParams: SelectedElementParams = {
    unselectButtonProps: {
      onKeyDown: vi.fn(),
      onMouseDown: vi.fn(),
      onClick: vi.fn(),
      icon: null,
    },
  } as SelectedElementParams;

  it('renders the option title', () => {
    render(<MultiselectfieldSelectedItem option={mockOption} params={mockParams} />);

    expect(screen.getByText('Test Option')).toBeInTheDocument();
  });

  it('calls unselect handlers when button is clicked', () => {
    render(<MultiselectfieldSelectedItem option={mockOption} params={mockParams} />);

    const unselectButton = screen.getByRole('button');

    fireEvent.click(unselectButton);
    expect(mockParams.unselectButtonProps.onClick).toHaveBeenCalled();

    fireEvent.mouseDown(unselectButton);
    expect(mockParams.unselectButtonProps.onMouseDown).toHaveBeenCalled();

    fireEvent.keyDown(unselectButton);
    expect(mockParams.unselectButtonProps.onKeyDown).toHaveBeenCalled();
  });

  it('renders with correct height class', () => {
    const { container } = render(
      <MultiselectfieldSelectedItem option={mockOption} params={mockParams} />,
    );

    const chipElement = container.firstChild;
    expect(chipElement).toHaveClass('h-6');
  });

  it('renders the X icon in unselect button', () => {
    const { container } = render(
      <MultiselectfieldSelectedItem option={mockOption} params={mockParams} />,
    );

    const iconElement = container.querySelector('svg');
    expect(iconElement).toHaveClass('h-3', 'w-3');
  });
});
