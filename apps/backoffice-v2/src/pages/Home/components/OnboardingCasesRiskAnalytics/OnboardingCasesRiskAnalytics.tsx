import { Separator } from '@radix-ui/react-separator';

import { DateRangePicker } from '@/common/components/organisms/DateRangePicker/DateRangePicker';
import { useHomeLogic } from '@/common/hooks/useHomeLogic/useHomeLogic';
import { CaseGraphs } from '@/pages/Home/components/CaseGraphs/CaseGraphs';

export const OnboardingCasesRiskAnalytics = ({
  from,
  to,
  setDate,
}: {
  from: ReturnType<typeof useHomeLogic>['casesFrom'];
  to: ReturnType<typeof useHomeLogic>['casesTo'];
  setDate: ReturnType<typeof useHomeLogic>['setCasesDate'];
}) => {
  return (
    <div className="space-y-6">
      <Separator className="h-[1px] w-full bg-gray-300" />

      <div className="flex items-center justify-between">
        <h3 className={'text-xl font-bold'}>Onboarding Cases Risk Analytics</h3>

        <DateRangePicker
          toDate={new Date()}
          value={{
            from: from ? new Date(from) : undefined,
            to: to ? new Date(to) : undefined,
          }}
          onChange={setDate}
          className="justify-end"
        />
      </div>

      <CaseGraphs from={from} to={to} />
    </div>
  );
};
