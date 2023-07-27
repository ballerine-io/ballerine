import { AppShell } from '@app/components/layouts/AppShell';

export const LoadingPlaceholder = () => (
  <AppShell isLoading>
    <AppShell.FormContainer>
      <h2 className="text-muted-foreground text-sm">Loading workflow information...</h2>
    </AppShell.FormContainer>
  </AppShell>
);
