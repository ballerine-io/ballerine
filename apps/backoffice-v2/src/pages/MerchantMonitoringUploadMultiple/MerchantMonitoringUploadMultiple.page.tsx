import { Input } from '@ballerine/ui';
import { Link } from 'react-router-dom';
import { ChevronLeft, Download, Loader2 } from 'lucide-react';
import React, { FunctionComponent } from 'react';

import { Card } from '@/common/components/atoms/Card/Card';
import { Form } from '@/common/components/organisms/Form/Form';
import { FormItem } from '@/common/components/organisms/Form/Form.Item';
import { FormField } from '@/common/components/organisms/Form/Form.Field';
import { FormLabel } from '@/common/components/organisms/Form/Form.Label';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { FormControl } from '@/common/components/organisms/Form/Form.Control';
import { Button, buttonVariants } from '@/common/components/atoms/Button/Button';
import { FormDescription } from '@/common/components/organisms/Form/Form.Description';
import { useMerchantMonitoringUploadMultiplePageLogic } from '@/pages/MerchantMonitoringUploadMultiple/hooks/useMerchantMonitoringUploadMultiplePageLogic/useMerchantMonitoringUploadMultiplePageLogic';

export const MerchantMonitoringUploadMultiplePage: FunctionComponent = () => {
  const { form, isSubmitting, onSubmit, onChange, locale, csvTemplateUrl } =
    useMerchantMonitoringUploadMultiplePageLogic();

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
      <h1 className="pb-5 text-2xl font-bold">Upload Multiple Merchants</h1>
      <Card>
        <CardContent className={`px-10 pt-8`}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="merchantSheet"
                render={() => (
                  <FormItem className={`max-w-[250px]`}>
                    <FormLabel>Upload Merchants Sheet</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".csv"
                        onChange={onChange}
                        id={`merchantSheet`}
                        name={`merchantSheet`}
                        className="flex items-center"
                      />
                    </FormControl>
                    <FormDescription>File should follow the CSV template</FormDescription>
                  </FormItem>
                )}
              />
              <div className={`flex space-x-[50px]`}>
                <div className={`flex w-[200px] items-center`}>
                  <Button type="submit" size={`wide`} disabled={isSubmitting}>
                    Start Analyzing
                  </Button>
                  {isSubmitting && <Loader2 className={'ml-2 w-6 animate-spin'} />}
                </div>
                <a
                  href={csvTemplateUrl}
                  download="batch-report-template.csv"
                  className={'flex items-center space-x-2 text-[#007AFF] hover:underline'}
                >
                  <Download className={`d-6`} />
                  <span className={`text-sm font-medium leading-5`}>Download CSV template</span>
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};
