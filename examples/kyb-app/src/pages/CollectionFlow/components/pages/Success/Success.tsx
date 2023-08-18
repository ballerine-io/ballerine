import { withSessionProtected } from '@app/hooks/useSessionQuery/hocs/withSessionProtected';
import { Button, Card } from '@ballerine/ui';

export const Success = withSessionProtected(() => {
  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-full max-w-[646px] p-12">
        <div className="mb-9 flex justify-center">
          <img src="/public/papers-checked.svg" className="h-[156px] w-[156px]" />
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
          <Button variant="secondary" onClick={() => alert('Not implemented.')}>
            Go back to PayLynk’s Portal
          </Button>
        </div>
      </Card>
    </div>
  );
});
