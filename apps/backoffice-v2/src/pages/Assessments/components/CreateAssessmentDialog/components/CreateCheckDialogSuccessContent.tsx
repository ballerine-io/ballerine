import { CheckIcon } from 'lucide-react';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';

export const CreateCheckDialogSuccessContent = ({ subject }: { subject: string }) => {
  const { data: customer } = useCustomerQuery();
  const isDemoAccount = customer?.config?.isDemoAccount;

  return (
    <div className="mx-6 text-center">
      <div className="my-12 space-y-2">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
          <CheckIcon className="text-white d-12" />
        </div>

        <p className="mt-2">Your {subject} is being generated.</p>
      </div>

      <div className="mb-16 rounded-md border border-gray-200 bg-gray-50 px-1 py-2">
        {isDemoAccount && <p className="font-semibold">Ready in up to 24 hours</p>}
        <span>Your case is being generated.</span>
      </div>
    </div>
  );
};
