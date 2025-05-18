import { Input } from '@ballerine/ui';
import { CheckIcon, Loader2, Upload, X } from 'lucide-react';

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
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { useCreateDocumentVerificationCheckDialogLogic } from './hooks/useCreateDocumentVerificationCheckDialogLogic';

type CreateDocumentVerificationCheckDialogProps = {
  open: boolean;
  toggleOpen: (val?: boolean) => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export const CreateDocumentVerificationCheckDialog = ({
  disabled,
  children,
  open,
  toggleOpen: toggleOpenProps,
}: CreateDocumentVerificationCheckDialogProps) => {
  const { form, showSuccess, isSubmitting, onSubmit, reportsLeft, demoDaysLeft, toggleOpen } =
    useCreateDocumentVerificationCheckDialogLogic({ toggleOpen: toggleOpenProps });
  const { data: customer } = useCustomerQuery();
  const isDemoAccount = customer?.config?.isDemoAccount;

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogTrigger disabled={disabled} asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="px-0 sm:max-w-xl">
        <DialogHeader className="block font-medium sm:text-center">
          <h2 className={`text-2xl font-bold`}>Create Document Verification Case</h2>
          {isDemoAccount && <p>Try out Ballerine&apos;s Document Verification!</p>}
        </DialogHeader>

        {showSuccess ? (
          <CreateDocumentVerificationSuccessContent />
        ) : (
          <CreateDocumentVerificationCheckDialogFormContent
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

const CreateDocumentVerificationSuccessContent = () => {
  const { data: customer } = useCustomerQuery();
  const isDemoAccount = customer?.config?.isDemoAccount;

  return (
    <div className="mx-6 text-center">
      <div className="my-12 space-y-2">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
          <CheckIcon className="h-12 w-12 text-white" />
        </div>

        <p className="mt-2">Your document verification case is being processed.</p>
      </div>

      <div className="mb-16 rounded-md border border-gray-200 bg-gray-50 px-1 py-2">
        {isDemoAccount && <p className="font-semibold">Ready in up to 24 hours</p>}
        <span>You will receive an email alert once the verification is complete.</span>
      </div>
    </div>
  );
};

type CreateDocumentVerificationDialogFormContentProps = Pick<
  ReturnType<typeof useCreateDocumentVerificationCheckDialogLogic>,
  'form' | 'onSubmit' | 'isSubmitting' | 'demoDaysLeft' | 'reportsLeft'
>;

const CreateDocumentVerificationCheckDialogFormContent = ({
  form,
  onSubmit,
  isSubmitting,
  demoDaysLeft,
  reportsLeft,
}: CreateDocumentVerificationDialogFormContentProps) => {
  const shouldDisableForm =
    (reportsLeft && reportsLeft <= 0) || (demoDaysLeft && demoDaysLeft <= 0);
  const { data: customer } = useCustomerQuery();
  const isDemoAccount = customer?.config?.isDemoAccount;

  const files = form.watch('documentFiles') || [];

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
                name="companyName"
                render={({ field }) => (
                  <FormItem className="w-1/2 space-y-1">
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Company Name"
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
                name="merchantId"
                render={({ field }) => (
                  <FormItem className="w-1/2 space-y-1">
                    <FormLabel>Merchant ID (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Merchant ID"
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
                name="documentFiles"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem className="w-full space-y-1">
                    <FormLabel>Upload Documents</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <label
                          htmlFor="document-upload"
                          className="flex h-16 w-1/2 cursor-pointer items-center rounded-md border border-gray-200 bg-white px-3 text-sm hover:bg-gray-50"
                        >
                          <Upload className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span className="truncate">Select documents to upload</span>
                          <input
                            id="document-upload"
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png,application/pdf"
                            multiple
                            onChange={e => {
                              const newFiles = Array.from(e.target.files || []);
                              onChange([...(value || []), ...newFiles]);
                            }}
                            disabled={shouldDisableForm || isSubmitting}
                            {...field}
                          />
                        </label>

                        {files.length > 0 && (
                          <div className="mt-2 space-y-2">
                            <p className="text-sm font-medium">Selected files ({files.length}):</p>
                            <div className="max-h-32 overflow-y-auto rounded border border-gray-200 bg-white p-2">
                              {files.map((file, index) => (
                                <div
                                  key={`${file.name}-${index}`}
                                  className="flex items-center justify-between py-1"
                                >
                                  <span className="truncate text-sm">{file.name}</span>
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    className="ml-2 cursor-pointer text-gray-500 hover:text-gray-700"
                                    onClick={() => {
                                      const newFiles = [...files];
                                      newFiles.splice(index, 1);
                                      onChange(newFiles);
                                    }}
                                    onKeyDown={e => {
                                      if (e.key === 'Enter' || e.key === ' ') {
                                        const newFiles = [...files];
                                        newFiles.splice(index, 1);
                                        onChange(newFiles);
                                      }
                                    }}
                                    aria-label={`Remove ${file.name}`}
                                  >
                                    <X className="h-4 w-4" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
          </div>

          <div className="my-4 flex justify-end px-6">
            <Button
              type="submit"
              size="default"
              className="flex items-center gap-1.5 px-4 font-semibold aria-disabled:pointer-events-none aria-disabled:opacity-50"
              disabled={shouldDisableForm || isSubmitting || files.length === 0}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Verify Documents
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
