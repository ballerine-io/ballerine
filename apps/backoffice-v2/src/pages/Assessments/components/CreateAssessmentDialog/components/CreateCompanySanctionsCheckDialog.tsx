import { Input, SearchableDropdown } from '@ballerine/ui';
import { Loader2 } from 'lucide-react';

import { Button } from '@/common/components/atoms/Button/Button';
import { Select } from '@/common/components/atoms/Select/Select';
import { SelectContent } from '@/common/components/atoms/Select/Select.Content';
import { SelectGroup } from '@/common/components/atoms/Select/Select.Group';
import { SelectItem } from '@/common/components/atoms/Select/Select.Item';
import { SelectTrigger } from '@/common/components/atoms/Select/Select.Trigger';
import { SelectValue } from '@/common/components/atoms/Select/Select.Value';
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
import { ctw } from '@/common/utils/ctw/ctw';
import { getCountries, getCountryStates } from '@ballerine/common';
import { useCreateCompanySanctionsAssessmentDialogLogic } from '../hooks/useCreateCompanySanctionsAssessmentDialogLogic';
import { CreateAssessmentDialogProps } from '../types';
import { CreateCheckDialogSuccessContent } from './CreateCheckDialogSuccessContent';

export const CreateCompanySanctionsCheckDialog = ({
  disabled,
  trigger,
  open,
  toggleOpen: toggleOpenProps,
}: Omit<CreateAssessmentDialogProps, 'type'>) => {
  const { form, showSuccess, isSubmitting, onSubmit, toggleOpen } =
    useCreateCompanySanctionsAssessmentDialogLogic({ toggleOpen: toggleOpenProps });

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogTrigger disabled={disabled} asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="px-0 sm:max-w-xl">
        <DialogHeader className="block font-medium sm:text-center">
          <h2 className={`text-2xl font-bold`}>Create a Company Sanctions Check</h2>
        </DialogHeader>

        {showSuccess ? (
          <CreateCheckDialogSuccessContent subject="Company Sanctions check" />
        ) : (
          <CreateCompanySanctionsDialogContent
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export type CreateCompanySanctionsDialogContentProps = Pick<
  ReturnType<typeof useCreateCompanySanctionsAssessmentDialogLogic>,
  'form' | 'onSubmit' | 'isSubmitting'
>;

export const CreateCompanySanctionsDialogContent = ({
  form,
  onSubmit,
  isSubmitting,
}: CreateCompanySanctionsDialogContentProps) => {
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
                name="country"
                render={({ field }) => {
                  const countries = getCountries('en');
                  const availableCountries = countries.map(country => ({
                    value: country.const as string,
                    label: country.title as string,
                  }));

                  return (
                    <FormItem className="w-1/2 space-y-1">
                      <FormLabel>Country</FormLabel>
                      <div className="bg-white">
                        <FormControl>
                          <SearchableDropdown
                            value={field.value}
                            onChange={field.onChange}
                            options={availableCountries}
                            placeholder="Select a country"
                            disablePortal
                          />
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
