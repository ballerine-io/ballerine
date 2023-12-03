import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/Tabs';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { OverviewTabContent } from '@/pages/Overview/components/organisms/OverviewTabContent';

export const Overview = () => {
  return (
    <DashboardLayout pageName="Overview">
      <div className="flex h-full flex-col gap-4">
        <Tabs defaultValue="overview" className="flex flex-1 flex-col">
          <TabsList className="flex flex-row justify-start self-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="flex flex-1 flex-col space-y-4">
            <OverviewTabContent />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};
