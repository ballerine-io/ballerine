import '@ballerine/ui/lib/style.css';
import { AppShell } from '@app/components/layouts/AppShell';
import { Button } from '@ballerine/ui';

export const App = () => {
  return (
    <AppShell>
      <div>
        <Button>hello world</Button>
      </div>
    </AppShell>
  );
};
