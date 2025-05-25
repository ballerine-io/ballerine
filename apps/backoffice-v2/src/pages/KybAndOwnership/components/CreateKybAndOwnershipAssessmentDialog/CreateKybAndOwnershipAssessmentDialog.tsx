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
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { useCreateKybAndOwnershipAssessmentDialogLogic } from './hooks/useCreateKybAndOwnershipAssessmentDialogLogic';
import { Select } from '@/common/components/atoms/Select/Select';
import { SelectValue } from '@/common/components/atoms/Select/Select.Value';
import { SelectTrigger } from '@/common/components/atoms/Select/Select.Trigger';
import { SelectContent } from '@/common/components/atoms/Select/Select.Content';
import { SelectGroup } from '@/common/components/atoms/Select/Select.Group';
import { SelectItem } from '@/common/components/atoms/Select/Select.Item';
import { getCountries, getCountryStates } from '@ballerine/common';
import { ctw } from '@/common/utils/ctw/ctw';

type CreateKybAndOwnershipAssessmentDialogProps = {
  open: boolean;
  toggleOpen: (val?: boolean) => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export const CreateKybAndOwnershipAssessmentDialog = ({
  disabled,
  children,
  open,
  toggleOpen: toggleOpenProps,
}: CreateKybAndOwnershipAssessmentDialogProps) => {
  const { form, showSuccess, isSubmitting, onSubmit, toggleOpen } =
    useCreateKybAndOwnershipAssessmentDialogLogic({ toggleOpen: toggleOpenProps });

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogTrigger disabled={disabled} asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="px-0 sm:max-w-xl">
        <DialogHeader className="block font-medium sm:text-center">
          <h2 className={`text-2xl font-bold`}>Create a KYB & Ownership Case</h2>
        </DialogHeader>

        {showSuccess ? (
          <CreateKybAndUboCheckDialogSuccessContent />
        ) : (
          <CreateKybAndUboCheckDialogFormContent
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

const CreateKybAndUboCheckDialogSuccessContent = () => {
  const { data: customer } = useCustomerQuery();
  const isDemoAccount = customer?.config?.isDemoAccount;

  return (
    <div className="mx-6 text-center">
      <div className="my-12 space-y-2">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500">
          <CheckIcon className="text-white d-12" />
        </div>

        <p className="mt-2">Your KYB & Ownership check is being generated.</p>
      </div>

      <div className="mb-16 rounded-md border border-gray-200 bg-gray-50 px-1 py-2">
        {isDemoAccount && <p className="font-semibold">Ready in up to 24 hours</p>}
        <span>Your case is being generated.</span>
      </div>
    </div>
  );
};

type CreateKybAndUboCheckDialogFormContentProps = Pick<
  ReturnType<typeof useCreateKybAndOwnershipAssessmentDialogLogic>,
  'form' | 'onSubmit' | 'isSubmitting'
>;
const CreateKybAndUboCheckDialogFormContent = ({
  form,
  onSubmit,
  isSubmitting,
}: CreateKybAndUboCheckDialogFormContentProps) => {
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
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
                        placeholder="ACME Corp."
                        autoFocus
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem className="w-1/2 space-y-1">
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} disabled={isSubmitting} />
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
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              {form.watch('country') === 'US' && (
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
                              disabled={!hasStates || selectedCountry !== 'US'}
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
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              )}
              <FormField
                control={form.control}
                name="businessId"
                render={({ field }) => (
                  <FormItem className="w-1/2 space-y-1">
                    <FormLabel>Correlation ID (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="q1w2e3r4t5y6u7i8o9p0"
                        {...field}
                        disabled={isSubmitting}
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
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin d-6" />}
            Create Case
          </Button>
        </form>
      </Form>
    </div>
  );
};
