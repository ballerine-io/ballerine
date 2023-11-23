import { Header } from '@/components/organisms/Header';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

interface Props {
  pageName: string;
  children: React.ReactNode;
}

export const DashboardLayout = ({ pageName, children }: Props) => {
  return (
    <div className="box-border flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <h2 className="text-3xl font-bold tracking-tight ">{pageName}</h2>
        <div className="flex-1 overflow-auto">
          <QueryParamProvider adapter={ReactRouter6Adapter}>{children}</QueryParamProvider>
        </div>
      </div>
    </div>
  );
};
