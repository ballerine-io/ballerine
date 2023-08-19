import { useEffect } from 'react';
import { useSignin } from '@app/hooks/useSignin';
import { withSessionProtected } from '@app/hooks/useSessionQuery/hocs/withSessionProtected';
import { Button, Card } from '@ballerine/ui';
import { useActiveWorkflowQuery } from '@app/hooks/useActiveWorkflowQuery';

export const Approved = withSessionProtected(() => {
  const { isFetching, flowData } = useActiveWorkflowQuery();
  const { logoutSilent } = useSignin();

  useEffect(() => {
    if (isFetching) return;

    if (flowData.status === 'approve') {
      setTimeout(logoutSilent, 250);
    }
  }, [isFetching, flowData, logoutSilent]);

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-[646px] p-12">
        <div className="mb-9 flex flex-col items-center gap-9">
          <img src="/app-logo.svg" className="h-[40px] w-[95px]" />
          <img src="/success-circle.svg" className="h-[156px] w-[156px]" />
        </div>
        <div className="mb-10">
          <h1 className="mb-6 text-center text-3xl font-bold leading-8">
            Application completed <br />
            successfully!
          </h1>
          <p className="text-muted-foreground text-center text-sm leading-5 opacity-50">
            Go back to PayLynk’s portal to use the system
          </p>
        </div>
        <div className="flex justify-center">
          <Button variant="secondary" onClick={() => alert('Not implemented.')}>
            Go back to PayLynk’s Portal
          </Button>
        </div>
      </Card>
    </div>
  );
});
