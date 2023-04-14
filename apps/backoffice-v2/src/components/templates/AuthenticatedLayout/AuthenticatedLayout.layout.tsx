import { Header } from '@/components/organisms/Header';
import { FunctionComponentWithChildren } from '@/types';
import { Sheet, SheetContent, SheetTrigger } from '@/components/atoms/Sheet/Sheet';
import { Button } from '@/components/atoms/Button';
import { Menu } from 'lucide-react';
import { useMedia } from 'react-use';

export const AuthenticatedLayout: FunctionComponentWithChildren = ({ children }) => {
  // useAuthenticatedLayout();
  const isLg = useMedia(`(min-width: 96rem)`);

  return (
    <div className={`grid grid-cols-1 2xl:grid-cols-[13rem_1fr]`}>
      {!isLg && (
        <Sheet>
          <SheetTrigger className={`fixed z-50 bottom-right-6`} asChild>
            <Button shape={`square`} variant={`default`} className={`!p-2`}>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent position={`left`} className={`w-[unset]`}>
            <Header />
          </SheetContent>
        </Sheet>
      )}
      {isLg && <Header />}
      <main className={`grid h-full grid-cols-[285px_1fr]`}>
        {/*<Outlet />*/}
        {children}
      </main>
    </div>
  );
};
