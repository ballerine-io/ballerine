import { useEffect } from 'react';
import { useActiveWorkflowQuery } from '@app/hooks/useActiveWorkflowQuery';
import { useSignin } from '@app/hooks/useSignin';
import { withSessionProtected } from '@app/hooks/useSessionQuery/hocs/withSessionProtected';
import { Card } from '@ballerine/ui';

export const Rejected = withSessionProtected(() => {
  const { isFetching, flowData } = useActiveWorkflowQuery();
  const { logoutSilent } = useSignin();

  useEffect(() => {
    if (isFetching) return;

    if (flowData.status === 'reject') {
      setTimeout(logoutSilent, 250);
    }
  }, [isFetching, flowData, logoutSilent]);

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-[646px] p-12">
        <div className="mb-9 flex flex-col items-center gap-9">
          <img src="/public/app-logo.svg" className="h-[40px] w-[95px]" />
          <img src="/public/failed-circle.svg" className="h-[156px] w-[156px]" />
        </div>
        <div className="mb-10">
          <h1 className="mb-6 text-center text-3xl font-bold leading-8">
            Account activation rejected
          </h1>
          <p className="text-muted-foreground text-center text-sm leading-5 opacity-50">
            It seems like there was a problem with activating your account.
            <br /> For more information, please contact support at
            <br /> support@paylynk.com
          </p>
        </div>
      </Card>
    </div>
  );
});
