import { DialogClose } from '@radix-ui/react-dialog';
import { CircleCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { Button } from '@/common/components/atoms/Button/Button';
import { Separator } from '@/common/components/atoms/Separator/Separator';
import { Dialog } from '@/common/components/organisms/Dialog/Dialog';
import { DialogContent } from '@/common/components/organisms/Dialog/Dialog.Content';
import { DialogDescription } from '@/common/components/organisms/Dialog/Dialog.Description';
import { DialogFooter } from '@/common/components/organisms/Dialog/Dialog.Footer';
import { DialogHeader } from '@/common/components/organisms/Dialog/Dialog.Header';
import { DialogTitle } from '@/common/components/organisms/Dialog/Dialog.Title';
import { useToggle } from '@/common/hooks/useToggle/useToggle';
import { BusinessReportsLeftCard } from '@/domains/business-reports/components/BusinessReportsLeftCard/BusinessReportsLeftCard';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { Skeleton } from '@ballerine/ui';

const benefits = [
  'Spot potential risks and violations',
  'Assess legitimacy and card scheme compliance',
  'Gain actionable insights instantly',
];

export const WelcomeModal = () => {
  const [open, toggleOpen] = useToggle(true);
  const { data: customer, isLoading: isLoadingCustomer } = useCustomerQuery();
  const locale = useLocale();

  if (isLoadingCustomer || customer?.config?.demoAccessDetails?.seenWelcomeModal !== false) {
    return null;
  }

  const { reportsLeft, demoDaysLeft } = customer?.config?.demoAccessDetails ?? {};

  return (
    <Dialog open={open} onOpenChange={toggleOpen}>
      <DialogContent className="px-0 sm:max-w-xl">
        <DialogHeader className="items-center px-6">
          <DialogTitle className={`text-2xl`}>Welcome to Ballerine</DialogTitle>
          <DialogDescription className={`text-md`}>
            Welcome to Ballerine’s Web Presence Free Trial! 🚀
          </DialogDescription>
        </DialogHeader>
        <div className="px-6">
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <Skeleton className="absolute inset-0 size-full" />
            <iframe
              src="https://www.loom.com/embed/7cd69b5e2db24e81ace760cc38b3d7dc?sid=69a0ffbf-bd57-4e88-b9db-cbf819da21d3"
              frameBorder="0"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          </div>
        </div>

        <BusinessReportsLeftCard
          reportsLeft={reportsLeft}
          demoDaysLeft={demoDaysLeft}
          className="mx-6"
        />

        <Separator />

        <div className="space-y-4 px-6">
          <p className="font-bold">Analyze any merchant&apos;s online presence</p>

          {benefits.map(benefit => (
            <div key={benefit} className="flex items-center gap-2">
              <CircleCheck className="text-success d-5" />
              <p>{benefit}</p>
            </div>
          ))}
        </div>

        <Separator />

        <DialogFooter className="px-6">
          <DialogClose asChild>
            <Link to={`${locale}/merchant-monitoring`}>
              <Button className="text-md rounded-lg font-bold">Get Started</Button>
            </Link>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
