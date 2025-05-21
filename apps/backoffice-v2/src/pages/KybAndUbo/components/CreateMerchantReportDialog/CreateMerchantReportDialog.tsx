import { Input } from '@ballerine/ui';
import { CheckIcon, Loader2 } from 'lucide-react';

import { Button } from '@/common/components/atoms/Button/Button';
import { Dialog } from '@/common/components/organisms/Dialog/Dialog';
import { DialogContent } from '@/common/components/organisms/Dialog/Dialog.Content';
import { DialogHeader } from '@/common/components/organisms/Dialog/Dialog.Header';
import { DialogTrigger } from '@/common/components/organisms/Dialog/Dialog.Trigger';
import { Form } from '@/common/components/organisms/Form/Form';
import { FormControl } from '@/common/components/organisms/Form/Form.Control';
import { FormField } from '@/common/components/organisms/Form/Form.Field';
import { FormItem } from '@/common/components/organisms/Form/Form.Item';
import { FormLabel } from '@/common/components/organisms/Form/Form.Label';
import { FormMessage } from '@/common/components/organisms/Form/Form.Message';
import { BusinessReportsLeftCard } from '@/domains/business-reports/components/BusinessReportsLeftCard/BusinessReportsLeftCard';
import { useCreateMerchantReportDialogLogic } from './hooks/useCreateMerchantReportDialogLogic';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';

type CreateMerchantReportDialogProps = {
  open: boolean;
  toggleOpen: (val?: boolean) => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export const CreateMerchantReportDialog = ({
  disabled,
  children,
  open,
  toggleOpen: toggleOpenProps,
}: CreateMerchantReportDialogProps) => {
  const { form, showSuccess, isSubmitting, onSubmit, reportsLeft, demoDaysLeft, toggleOpen } =
    useCreateMerchantReportDialogLogic({ toggleOpen: toggleOpenProps });
  const { data: customer } = useCustomerQuery();
  const isDemoAccount = customer?.config?.isDemoAccount;

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogTrigger disabled={disabled} asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="px-0 sm:max-w-xl">
        <DialogHeader className="block font-medium sm:text-center">
          <h2 className={`text-2xl font-bold`}>Create a Web Presence Report</h2>
          {isDemoAccount && <p>Try out Ballerine&apos;s Web Presence Report!</p>}
        </DialogHeader>

        {showSuccess ? (
          <CreateMerchantReportDialogSuccessContent />
        ) : (
          <CreateMerchantReportDialogFormContent
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            demoDaysLeft={demoDaysLeft}
            reportsLeft={reportsLeft}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

const CreateMerchantReportDialogSuccessContent = () => {
  const { data: customer } = useCustomerQuery();
  const isDemoAccount = customer?.config?.isDemoAccount;

  return (
    <div className="mx-6 text-center">
      <div className="my-12 space-y-2">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
          <CheckIcon className="text-white d-12" />
        </div>

        <p className="mt-2">Your report is being generated.</p>
      </div>

      <div className="mb-16 rounded-md border border-gray-200 bg-gray-50 px-1 py-2">
        {isDemoAccount && <p className="font-semibold">Ready in up to 24 hours</p>}
        <span>You will receive an email alert once the report is ready.</span>
      </div>
    </div>
  );
};

type CreateMerchantReportDialogFormContentProps = Pick<
  ReturnType<typeof useCreateMerchantReportDialogLogic>,
  'form' | 'onSubmit' | 'isSubmitting' | 'demoDaysLeft' | 'reportsLeft'
>;
const CreateMerchantReportDialogFormContent = ({
  form,
  onSubmit,
  isSubmitting,
  demoDaysLeft,
  reportsLeft,
}: CreateMerchantReportDialogFormContentProps) => {
  const shouldDisableForm =
    (reportsLeft && reportsLeft <= 0) || (demoDaysLeft && demoDaysLeft <= 0);
  const { data: customer } = useCustomerQuery();
  const isDemoAccount = customer?.config?.isDemoAccount;

  return (
    <div>
      {isDemoAccount && (
        <BusinessReportsLeftCard
          reportsLeft={reportsLeft}
          demoDaysLeft={demoDaysLeft}
          className="mx-6 mt-6"
        />
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          {shouldDisableForm && (
            <div className="absolute right-0 top-0 h-full w-full bg-white opacity-70" />
          )}

          <div className="my-12 border-y border-gray-200 bg-gray-50 py-6">
            <fieldset className="mx-6 space-y-4">
              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem className="w-1/2 space-y-1">
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="www.example.com"
                        autoFocus
                        {...field}
                        disabled={shouldDisableForm || isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem className="w-1/2 space-y-1">
                    <FormLabel>Company Name (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ACME Corp."
                        {...field}
                        disabled={shouldDisableForm || isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessCorrelationId"
                render={({ field }) => (
                  <FormItem className="w-1/2 space-y-1">
                    <FormLabel>Merchant ID (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="q1w2e3r4t5y6u7i8o9p0"
                        {...field}
                        disabled={shouldDisableForm || isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
          </div>

          <Button
            type="submit"
            size="wide"
            className={
              'mx-6 ml-auto flex items-center gap-1.5 px-6 font-bold aria-disabled:pointer-events-none aria-disabled:opacity-50'
            }
            disabled={shouldDisableForm || isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin d-6" />}
            Get a Report
          </Button>
        </form>
      </Form>
    </div>
  );
};
