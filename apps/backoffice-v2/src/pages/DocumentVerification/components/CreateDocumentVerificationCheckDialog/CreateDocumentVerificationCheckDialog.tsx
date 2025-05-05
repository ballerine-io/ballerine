import { Input } from '@ballerine/ui';
import { CheckIcon, Loader2, Upload } from 'lucide-react';

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
import { ctw } from '@/common/utils/ctw/ctw';
import { getCountries, getCountryStates } from '@ballerine/common';
import { Select } from '@/common/components/atoms/Select/Select';
import { SelectTrigger } from '@/common/components/atoms/Select/Select.Trigger';
import { SelectValue } from '@/common/components/atoms/Select/Select.Value';
import { SelectContent } from '@/common/components/atoms/Select/Select.Content';
import { SelectGroup } from '@/common/components/atoms/Select/Select.Group';
import { SelectItem } from '@/common/components/atoms/Select/Select.Item';

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
          <CheckIcon className="text-white d-12" />
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
                name="firstName"
                render={({ field }) => (
                  <FormItem className="w-1/2 space-y-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
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
                name="lastName"
                render={({ field }) => (
                  <FormItem className="w-1/2 space-y-1">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
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
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="w-1/2 space-y-1">
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="1990-01-01"
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
                name="country"
                render={({ field }) => {
                  const countries = getCountries('en');
                  const availableCountries = countries.map(country => ({
                    value: country.const,
                    label: country.title,
                  }));

                  return (
                    <FormItem className="w-1/2 space-y-1">
                      <FormLabel>Country</FormLabel>
                      <div className="bg-white">
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="h-9 w-full">
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {availableCountries.map(country => (
                                  <SelectItem key={country.value} value={country.value}>
                                    {country.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </div>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => {
                  const selectedCountry = form.watch('country');
                  const states = selectedCountry ? getCountryStates(selectedCountry) : [];
                  const availableStates = states.map(state => ({
                    value: state.isoCode,
                    label: state.name,
                  }));
                  const hasStates = availableStates.length > 0;

                  return (
                    <FormItem className="w-1/2 space-y-1">
                      <FormLabel>State/Province</FormLabel>
                      <div className={ctw('bg-white', !hasStates && 'opacity-50')}>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!hasStates}
                          >
                            <SelectTrigger className="h-9 w-full">
                              <SelectValue
                                placeholder={hasStates ? 'Select a state' : 'No states available'}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {availableStates.map(state => (
                                  <SelectItem key={state.value} value={state.value}>
                                    {state.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </div>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="documentType"
                render={({ field }) => {
                  const documentTypes = [
                    { value: 'passport', label: 'Passport' },
                    { value: 'driver_license', label: 'Driver License' },
                    { value: 'id_card', label: 'ID Card' },
                    { value: 'residence_permit', label: 'Residence Permit' },
                  ];

                  return (
                    <FormItem className="w-1/2 space-y-1">
                      <FormLabel>Document Type</FormLabel>
                      <div className="bg-white">
                        <FormControl>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="h-9 w-full">
                              <SelectValue placeholder="Select document type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {documentTypes.map(type => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </div>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="documentFile"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem className="w-full space-y-1">
                    <FormLabel>Upload Document</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="document-upload"
                          className="flex h-9 w-full cursor-pointer items-center rounded-md border border-gray-200 bg-white px-3 text-sm hover:bg-gray-50"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {value ? value.name : 'Choose file'}
                          <input
                            id="document-upload"
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png,application/pdf"
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                onChange(file);
                              }
                            }}
                            disabled={shouldDisableForm || isSubmitting}
                            {...field}
                          />
                        </label>
                      </div>
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
            Verify Document
          </Button>
        </form>
      </Form>
    </div>
  );
};
