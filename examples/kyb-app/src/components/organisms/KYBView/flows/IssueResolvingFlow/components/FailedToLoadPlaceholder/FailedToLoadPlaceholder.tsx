import { AppShell } from '@app/components/layouts/AppShell';

interface Props {
  message?: string;
}

export const FailedToLoadPlaceholder = ({ message }: Props) => (
  <AppShell isLoading>
    <AppShell.FormContainer>
      <h1 className="font-inter scroll-m-20 pb-2 text-3xl font-bold tracking-tight transition-colors first:mt-0">
        Failed to load workflow.
      </h1>
      {message ? <h2 className="text-muted-foreground text-sm">{message}</h2> : null}
    </AppShell.FormContainer>
  </AppShell>
);
