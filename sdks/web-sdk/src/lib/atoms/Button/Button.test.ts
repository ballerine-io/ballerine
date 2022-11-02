import { fireEvent, render, screen } from '@testing-library/svelte';
import Button from './Button.svelte';
import TestButton from './TestButton.svelte';

describe('Button', () => {
  it('should render a button', async () => {
    render(TestButton, {
      props: {
        configuration: {},
      },
    });

    const button = screen.getByRole('button', { name: /test/i });

    await fireEvent.click(button);

    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });
});
