import { Link } from 'react-router-dom';
import React, { FunctionComponent } from 'react';
import { ChevronDown, ChevronLeft, HelpCircle, Loader2 } from 'lucide-react';

import { Input } from '@ballerine/ui';
import { ctw } from '@/common/utils/ctw/ctw';
import { Card } from '@/common/components/atoms/Card/Card';
import { Label } from '@/common/components/atoms/Label/Label';
import { Form } from '@/common/components/organisms/Form/Form';
import { FormItem } from '@/common/components/organisms/Form/Form.Item';
import { Checkbox_ } from '@/common/components/atoms/Checkbox_/Checkbox_';
import { FormField } from '@/common/components/organisms/Form/Form.Field';
import { FormLabel } from '@/common/components/organisms/Form/Form.Label';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { Combobox } from '@/common/components/organisms/Combobox/Combobox';
import { Dropdown } from '@/common/components/molecules/Dropdown/Dropdown';
import { FormControl } from '@/common/components/organisms/Form/Form.Control';
import { FormMessage } from '@/common/components/organisms/Form/Form.Message';
import { Button, buttonVariants } from '@/common/components/atoms/Button/Button';
import { RiskSelect } from '@/pages/MerchantMonitoringCreateCheck/components/RiskSelect/RiskSelect';
import { SwitchesList } from '@/pages/MerchantMonitoringCreateCheck/components/SwitchesList/SwitchesList';
import { useMerchantMonitoringCreateBusinessReportPageLogic } from '@/pages/MerchantMonitoringCreateCheck/hooks/useMerchantMonitoringCreateBusinessReportPageLogic/useMerchantMonitoringCreateBusinessReportPageLogic';

export const MerchantMonitoringCreateCheckPage: FunctionComponent = () => {
  const {
    comboboxCountryCodes,
    form,
    onSubmit,
    locale,
    isChangeChecksConfigurationOpen,
    toggleIsChangeChecksConfigurationOpen,
    isChangeRiskAppetiteConfigurationOpen,
    toggleIsChangeRiskAppetiteConfigurationOpen,
    checksConfiguration,
    riskLabels,
    industries,
    isCreateReportReady,
    onValueChange,
  } = useMerchantMonitoringCreateBusinessReportPageLogic();

  return (
    <section className="flex h-full flex-col px-6 pb-6 pt-10">
      <div>
        <Link
          to={`/${locale}/merchant-monitoring`}
          className={buttonVariants({
            variant: 'ghost',
            className: 'mb-6 flex items-center space-x-[1px] pe-3 ps-1 font-semibold',
          })}
        >
          <ChevronLeft size={18} /> <span>Back to Reports</span>
        </Link>
      </div>
      <h1 className="pb-5 text-2xl font-bold">Create Merchant Check</h1>
      <h3 className="pb-5 text-sm">Registered Company Name</h3>
      <Card>
        <CardContent className={`px-10 pt-8`}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem className={`max-w-[185px]`}>
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="www.example.com"
                        autoFocus
                        {...field}
                        onChange={onValueChange(field.onChange)}
                      />
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
                        <Input
                          placeholder="ACME Corp."
                          {...field}
                          onChange={onValueChange(field.onChange)}
                        />
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
                    <FormItem>
                      <FormLabel>Business ID (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="q1w2e3r4t5y6u7i8o9p0"
                          {...field}
                          onChange={onValueChange(field.onChange)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </fieldset>
              <div className={'space-y-2'}>
                <div className="flex items-center space-x-2">
                  <Checkbox_
                    id={'change-checks-configuration'}
                    className={'border-[#E5E7EB]'}
                    checked={isChangeChecksConfigurationOpen}
                    onCheckedChange={toggleIsChangeChecksConfigurationOpen}
                  />
                  <Label htmlFor="change-checks-configuration">Change Checks Configuration</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox_
                    id={'change-risk-appetite-configuration'}
                    className={'border-[#E5E7EB]'}
                    checked={isChangeRiskAppetiteConfigurationOpen}
                    onCheckedChange={toggleIsChangeRiskAppetiteConfigurationOpen}
                  />
                  <Label htmlFor="change-risk-appetite-configuration">
                    Change Risk Appetite Configuration
                  </Label>
                </div>
              </div>
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem className={`max-w-md`}>
                    <FormLabel className={`flex items-center space-x-1 text-slate-500`}>
                      <span>Industry</span>
                      <HelpCircle size={18} className={`fill-foreground stroke-background`} />
                    </FormLabel>
                    <FormControl>
                      <Dropdown
                        options={industries}
                        trigger={
                          <>
                            Select an industry...
                            <ChevronDown size={18} className={`text-slate-400`} />
                          </>
                        }
                        props={{
                          trigger: {
                            className:
                              'flex w-full items-center justify-between gap-x-4 rounded-lg border border-neutral/10 px-4 py-1.5 text-sm disabled:opacity-50 dark:border-neutral/60',
                            disabled: true,
                          },
                          content: {
                            className: 'w-full',
                            align: 'start',
                          },
                        }}
                        {...field}
                      >
                        {({ item, DropdownItem }) => (
                          <DropdownItem key={item.id}>{item.value}</DropdownItem>
                        )}
                      </Dropdown>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isChangeChecksConfigurationOpen && (
                <div
                  className={ctw('grid grid-cols-4 gap-y-8', {
                    '!mb-10': isChangeRiskAppetiteConfigurationOpen,
                  })}
                >
                  {checksConfiguration.map(({ label, options }) => (
                    <SwitchesList label={label} options={options} key={label} />
                  ))}
                </div>
              )}
              {isChangeRiskAppetiteConfigurationOpen && (
                <div>
                  <h3 className={'mb-8 font-bold'}>Risk Appetite Configurations</h3>
                  <div className={'grid grid-cols-5 gap-x-8 gap-y-6'}>
                    {riskLabels.map(({ label, defaultValue, disabled }) => (
                      <RiskSelect
                        key={label}
                        label={label}
                        defaultValue={defaultValue}
                        disabled={disabled}
                      />
                    ))}
                  </div>
                </div>
              )}
              <Button
                type="submit"
                size={`wide`}
                aria-disabled={isCreateReportReady}
                className={'aria-disabled:pointer-events-none aria-disabled:opacity-50'}
              >
                <Loader2
                  className={ctw('me-2 h-4 w-4 animate-spin', { hidden: !isCreateReportReady })}
                />
                Start Analyzing
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};
