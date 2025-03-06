import { ctw } from '@ballerine/ui';
import { t } from 'i18next';
import { ArrowRightIcon } from 'lucide-react';
import { ComponentPropsWithoutRef } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/common/components/atoms/Button/Button';
import { UserAvatar } from '@/common/components/atoms/UserAvatar/UserAvatar';
import { env } from '@/common/env/env';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { getDemoStateErrorText } from './getDemoStateErrorText';

export type ExperienceBallerineCardProps = {
  firstName?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  onClick?: () => void;
  className?: string;
};

const CreateReportButtonBase = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof Button>) => (
  <Button
    variant="wp-outline"
    role="link"
    className={ctw('space-x-2 self-start text-base', className)}
    {...props}
  />
);

const CreateReportButton = ({
  onClick,
  locale,
  ...props
}: Pick<ExperienceBallerineCardProps, 'onClick'> &
  ComponentPropsWithoutRef<typeof Button> & {
    locale: ReturnType<typeof useLocale>;
  }) => {
  const buttonContent = (
    <>
      <span>Create a report</span>
      <ArrowRightIcon className="d-4" />
    </>
  );

  if (onClick) {
    return (
      <CreateReportButtonBase onClick={onClick} {...props}>
        {buttonContent}
      </CreateReportButtonBase>
    );
  }

  return (
    <CreateReportButtonBase asChild {...props}>
      <Link to={`/${locale}/merchant-monitoring?isCreating=true`}>{buttonContent}</Link>
    </CreateReportButtonBase>
  );
};

export const ExperienceBallerineCard = ({
  firstName,
  fullName,
  avatarUrl,
  className,
  onClick,
}: ExperienceBallerineCardProps) => {
  const { data: customer } = useCustomerQuery();
  const locale = useLocale();

  const { reportsLeft, demoDaysLeft } = customer?.config?.demoAccessDetails ?? {};
  const error = getDemoStateErrorText({ reportsLeft, demoDaysLeft });

  return (
    <div
      className={ctw(
        'flex flex-col justify-between gap-2 rounded-md border border-gray-300 bg-white px-6 py-4 shadow-sm',
        className,
      )}
    >
      <div className={`flex items-center gap-2`}>
        {avatarUrl && <UserAvatar fullName={fullName} className={`!d-7`} avatarUrl={avatarUrl} />}
        <h3 className={`text-xl font-semibold`}>
          {t(`home.greeting`)}
          {firstName && ` ${firstName}`}
        </h3>
        {!error && <span className="ml-2 text-destructive">{demoDaysLeft} days left</span>}
      </div>

      <p className="leading-loose">
        {error ? (
          <>
            <span className="text-destructive">{error}</span>
            <br />
            To continue using the system,{' '}
            <span className="font-semibold">book a quick call with us.</span>
          </>
        ) : (
          <>
            💎 You have <span className="font-semibold">{reportsLeft} Web Presence reports</span>{' '}
            available.
            <br />
            Get started now! 🚀
          </>
        )}
      </p>

      <CreateReportButton
        className="aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
        onClick={onClick}
        locale={locale}
        aria-disabled={!!error}
        tabIndex={error ? -1 : 0}
      />
    </div>
  );
};
