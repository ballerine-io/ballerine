import { useCustomer } from '@/components/providers/CustomerProvider';
import { withSessionProtected } from '@/hooks/useSessionQuery/hocs/withSessionProtected';
import { Button, Card } from '@ballerine/ui';

export const Success = withSessionProtected(() => {
  const { customer } = useCustomer();

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-[646px] p-12">
        <div className="mb-9 flex justify-center">
          <img src="/papers-checked.svg" className="h-[156px] w-[156px]" />
        </div>
        <div className="mb-10">
          <h1 className="mb-6 text-center text-3xl font-bold leading-8">
            Thank you!
            <br /> We’re reviewing your application
          </h1>
          <h2 className="text-muted-foreground text-center text-sm leading-5 opacity-50">
            We will inform you by email once your account is ready.
          </h2>
        </div>
        <div className="flex justify-center">
          <Button
            variant="secondary"
            onClick={() => {
              // @ts-ignore
              location.href = customer?.websiteUrl;
            }}
          >
            Back to {customer?.displayName} Portal
          </Button>
        </div>
      </Card>
    </div>
  );
});
