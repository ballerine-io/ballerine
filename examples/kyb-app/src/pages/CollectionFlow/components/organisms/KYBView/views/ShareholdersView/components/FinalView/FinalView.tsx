import { AppShell } from '@app/components/layouts/AppShell';

export const FinalView = () => {
  return (
    <AppShell.FormContainer>
      <h1 className="font-inter scroll-m-20 pb-2 text-3xl font-bold tracking-tight transition-colors first:mt-0">
        Thank you!
        <br /> We’re reviewing your application
      </h1>
      <h2 className="text-muted-foreground text-sm">
        We will inform you by email once your account is ready.
      </h2>
    </AppShell.FormContainer>
  );
};
