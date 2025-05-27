import { ReactNode } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Card } from '@/common/components/atoms/Card/Card';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { ctw } from '@/common/utils/ctw/ctw';
import { StatsCard } from '@/pages/Home/components/StatsCard/StatsCard';

export const CurrentPortfolioStatus = () => {
  // if (!isMerchantMonitoringEnabled && !isOngoingMonitoringEnabled) {
  //   return null;
  // }

  const activeCasesByStageData = [
    { stage: 'Collection In Progress', count: 76 },
    { stage: 'Awaiting 3rd Party Data', count: 17 },
    { stage: 'Awaiting ID Verification', count: 1 },
    { stage: 'Revisions', count: 34 },
    { stage: 'Manual Review', count: 41 },
  ];

  return (
    <>
      <h3 className={'text-xl font-medium'}>Current Portfolio Status</h3>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7 grid grid-cols-3 gap-6">
          <StatsCard
            value={628}
            title="Overall Active Onboarding Cases "
            description="All time cases that haven’t reached a decision"
          />

          <StatsCard
            value={1021}
            title="Overall Active Merchants in Portfolio"
            description="Active merchants in your portfolio"
          />

          <StatsCard
            value={25}
            title="Overall Active Monitoring Alerts"
            description="Cases that haven’t reached a decision, in selected time range"
          />

          <div className="col-span-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-2 text-lg font-medium">Active Cases by Onboarding Stage</h3>
            <p className="mb-4 text-sm text-gray-500">
              Number of cases that haven't reached a final decision, by onboarding stage.
            </p>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activeCasesByStageData}
                  layout="horizontal"
                  margin={{ top: 0, right: 0, left: 0, bottom: -40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="category"
                    dataKey="stage"
                    tick={{ fontSize: 11 }}
                    height={70}
                    interval={0}
                  />
                  <YAxis type="number" />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    name="Active Cases"
                    fill="#4F46E5"
                    radius={[4, 4, 0, 0]}
                    barSize={35}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-span-5 w-full">
          <Card
            className="border border-wp-primary"
            style={{
              background:
                'linear-gradient(45deg, rgba(113, 100, 255, 0.22) 0%, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 1) 92%)',
            }}
          >
            <CardHeader className="flex-row items-center gap-2 pb-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="12" fill="#968FDE" />
                <path
                  d="M10.6248 14.3332C10.5653 14.1025 10.445 13.8919 10.2765 13.7234C10.1081 13.5549 9.8975 13.4347 9.66679 13.3752L5.57679 12.3205C5.50701 12.3007 5.4456 12.2587 5.40186 12.2008C5.35813 12.1429 5.33447 12.0724 5.33447 11.9998C5.33447 11.9273 5.35813 11.8567 5.40186 11.7989C5.4456 11.741 5.50701 11.699 5.57679 11.6792L9.66679 10.6238C9.89742 10.5644 10.1079 10.4442 10.2764 10.2759C10.4449 10.1075 10.5652 9.8971 10.6248 9.66651L11.6795 5.57651C11.6991 5.50645 11.741 5.44474 11.799 5.40077C11.857 5.35681 11.9277 5.33301 12.0005 5.33301C12.0732 5.33301 12.144 5.35681 12.2019 5.40077C12.2599 5.44474 12.3019 5.50645 12.3215 5.57651L13.3755 9.66651C13.435 9.89722 13.5552 10.1078 13.7237 10.2763C13.8922 10.4447 14.1027 10.565 14.3335 10.6245L18.4235 11.6785C18.4938 11.6979 18.5558 11.7398 18.6 11.7979C18.6442 11.8559 18.6682 11.9269 18.6682 11.9998C18.6682 12.0728 18.6442 12.1437 18.6 12.2018C18.5558 12.2598 18.4938 12.3018 18.4235 12.3212L14.3335 13.3752C14.1027 13.4347 13.8922 13.5549 13.7237 13.7234C13.5552 13.8919 13.435 14.1025 13.3755 14.3332L12.3208 18.4232C12.3012 18.4932 12.2592 18.5549 12.2012 18.5989C12.1433 18.6429 12.0725 18.6667 11.9998 18.6667C11.927 18.6667 11.8563 18.6429 11.7983 18.5989C11.7404 18.5549 11.6984 18.4932 11.6788 18.4232L10.6248 14.3332Z"
                  fill="white"
                />
              </svg>

              <h3 className="!mt-0 text-lg font-medium">90 Day AI Insights</h3>
            </CardHeader>

            <div className="flex flex-col gap-4 p-3">
              <InsightCard>
                <h4 className="font-medium">Manual Review Under-Assigned</h4>
                <p className="text-sm">21 of 41 reviews are unassigned.</p>
              </InsightCard>

              <InsightCard>
                <h4 className="font-medium">Slower Intake Flow</h4>
                <p className="text-sm">Collection-to-review time up 40% vs. last week.</p>
              </InsightCard>

              <InsightCard>
                <h4 className="font-medium">Faster Revision Handling</h4>
                <p className="text-sm">Revisions reviewed 20% faster vs. last month.</p>
              </InsightCard>

              <InsightCard>
                <h4 className="font-medium">Review Load Imbalance</h4>
                <p className="text-sm">Nitzan handles 45% of assigned currently active reviews.</p>
              </InsightCard>

              <InsightCard>
                <h4 className="font-medium">Early Stage Pile-Up</h4>
                <p className="text-sm">
                  91 cases (40%) are still in collection or waiting on data.
                </p>
              </InsightCard>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

const InsightCard = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <div className={ctw('relative overflow-hidden rounded-md px-6 py-4', className)}>
      {children}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(75deg, rgba(113, 100, 255, 0.22) 0%,  rgba(88, 78, 197, 0.22) 92%)',
        }}
      />
    </div>
  );
};
