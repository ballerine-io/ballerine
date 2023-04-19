import { fireEvent, render, screen } from '@testing-library/svelte';
import TestButton from './Button.test.svelte';

describe('Button', () => {
  it('should render a button', async () => {
    render(TestButton, {
      props: {},
    });

    const button = screen.getByRole('button', { name: /test/i });

    await fireEvent.click(button);

    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });
});
