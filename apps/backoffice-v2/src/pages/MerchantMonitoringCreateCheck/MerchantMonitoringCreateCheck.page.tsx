import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/common/components/atoms/Card/Card';
import { Button } from '@/common/components/atoms/Button/Button';
import { Form } from '@/common/components/organisms/Form/Form';
import { FormField } from '@/common/components/organisms/Form/Form.Field';
import { FormItem } from '@/common/components/organisms/Form/Form.Item';
import { FormLabel } from '@/common/components/organisms/Form/Form.Label';
import { FormControl } from '@/common/components/organisms/Form/Form.Control';
import { Input } from '@ballerine/ui';
import { FormMessage } from '@/common/components/organisms/Form/Form.Message';
import { SubmitHandler, useForm } from 'react-hook-form';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { Checkbox_ } from '@/common/components/atoms/Checkbox_/Checkbox_';
import { Combobox } from '@/common/components/organisms/Combobox/Combobox';
import { countryCodes } from '@ballerine/common';
import { useCreateBusinessReportMutation } from '@/domains/business-reports/hooks/mutations/useCreateBusinessReportMutation/useCreateBusinessReportMutation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from 'lucide-react';
import { useLocale } from '@/common/hooks/useLocale/useLocale';

export const CreateBusinessReportSchema = z
  .object({
    websiteUrl: z.string().url({
      message: 'Invalid website URL',
    }),
    companyName: z.union([
      z
        .string({
          required_error: 'Company name is required',
          invalid_type_error: 'Company name must be a string',
        })
        .max(255),
      z.undefined(),
    ]),
    operatingCountry: z.union([
      z.enum(
        // @ts-expect-error - countryCodes is an array of strings but its always the same strings
        countryCodes,
        {
          errorMap: () => {
            return {
              message: 'Invalid operating country',
            };
          },
        },
      ),
      z.undefined(),
    ]),
    businessId: z.union([
      z
        .string({
          required_error: 'Business ID is required',
          invalid_type_error: 'Business ID must be a string',
        })
        .max(255),
      z.undefined(),
    ]),
  })
  .superRefine((v, ctx) => {
    if (v.companyName || v.businessId) {
      return;
    }

    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Company name or business ID must be provided',
      path: ['companyName'],
    });
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Company name or business ID must be provided',
      path: ['businessId'],
    });
  });

export const useMerchantMonitoringCreateBusinessReportPageLogic = () => {
  const form = useForm({
    defaultValues: {
      websiteUrl: undefined,
      companyName: undefined,
      operatingCountry: undefined,
      businessId: undefined,
    },
    resolver: zodResolver(CreateBusinessReportSchema),
  });
  const { mutate: mutateCreateBusinessReport } = useCreateBusinessReportMutation({
    reportType: 'MERCHANT_REPORT_T1',
    onSuccess: () => {
      form.reset();
    },
  });
  const onSubmit: SubmitHandler<z.output<typeof CreateBusinessReportSchema>> = data => {
    mutateCreateBusinessReport(data);
  };
  const comboboxCountryCodes = countryCodes.map(countryCode => ({
    label: countryCode,
    value: countryCode,
  }));
  const locale = useLocale();

  return {
    form,
    onSubmit,
    comboboxCountryCodes,
    locale,
  };
};

export const MerchantMonitoringCreateCheckPage: FunctionComponent = () => {
  const { comboboxCountryCodes, form, onSubmit, locale } =
    useMerchantMonitoringCreateBusinessReportPageLogic();

  return (
    <section className="flex h-full flex-col px-6 pb-6 pt-10">
      <Link
        to={`/${locale}/merchant-monitoring`}
        className={'mb-6 flex items-center space-x-[1px] font-semibold'}
      >
        <ChevronLeft size={18} /> <span>Back to Reports</span>
      </Link>
      <h1 className="pb-5 text-2xl font-bold">Create Merchant Check</h1>
      <h3 className="pb-5 text-sm">Registered Company Name</h3>
      <Card>
        <CardContent className={`pt-8`}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem className={`max-w-[185px]`}>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input placeholder="www.example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <fieldset className={`grid grid-cols-[300px_300px] gap-8`}>
                <legend className={`pb-4 text-sm font-bold`}>
                  Refine the results by adding additional information
                </legend>
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registered Company Name (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="ACME Corp." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="operatingCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operating Country (Optional)</FormLabel>
                      <FormControl>
                        <Combobox
                          props={{
                            button: {
                              className: 'w-[240px] py-[0.45rem] h-[unset]',
                            },
                            popoverContent: {
                              align: 'start',
                            },
                          }}
                          items={comboboxCountryCodes}
                          resource={'country'}
                          {...field}
                          onChange={value => {
                            field.onChange(value.toUpperCase());
                          }}
                          value={field.value?.toUpperCase()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="businessId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business ID (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="q1w2e3r4t5y6u7i8o9p0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </fieldset>
              <div className={'space-y-2'}>
                <div className="flex items-center space-x-2">
                  <Checkbox_ id={'change-checks-configuration'} className={'border-[#E5E7EB]'} />
                  <label
                    htmlFor="change-checks-configuration"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Change Checks Configuration
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox_
                    id={'change-risk-appetite-configuration'}
                    className={'border-[#E5E7EB]'}
                  />
                  <label
                    htmlFor="change-risk-appetite-configuration"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Change Risk Appetite Configuration
                  </label>
                </div>
              </div>
              <Button type="submit" size={`wide`}>
                Start Analyzing
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};
