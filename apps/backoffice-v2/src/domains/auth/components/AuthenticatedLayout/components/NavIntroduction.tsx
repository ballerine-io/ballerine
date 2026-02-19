import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';

export const NavIntroduction = () => {
  const { data: customer } = useCustomerQuery();

  // Only show the introduction in demo accounts
  if (!customer?.config?.isDemoAccount) {
    return null;
  }

  return (
    <div className="mb-6 px-2 transition-opacity group-data-[collapsible=icon]:opacity-0">
      <div className="rounded-lg border bg-white p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-2/3">
            <h3 className="text-sm font-bold">Introduction</h3>
            <p className="text-xs text-gray-700">
              Watch this quick introduction to learn how to use MiKashBoks effectively.
            </p>
          </div>
          <div className="flex w-3/4 items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 p-3 text-center text-xs text-slate-500">
            Introduction video coming soon.
          </div>
        </div>
      </div>
    </div>
  );
};
