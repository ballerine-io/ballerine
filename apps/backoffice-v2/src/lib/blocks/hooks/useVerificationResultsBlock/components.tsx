import React, { FunctionComponent, useState } from 'react';
import { Collapsible } from '@/common/components/molecules/Collapsible/Collapsible';
import { CollapsibleTrigger } from '@/common/components/molecules/Collapsible/Collapsible.Trigger';
import { CollapsibleContent } from '@/common/components/molecules/Collapsible/Collapsible.Content';
import { Badge } from '@ballerine/ui';
import { ChevronDown } from 'lucide-react';

// --- CollapsibleSection ---

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  statusBadge?: {
    text: string;
    variant: 'success' | 'destructive' | 'warning' | 'info' | 'violet';
  };
  children?: React.ReactNode;
}

export const CollapsibleSection: FunctionComponent<CollapsibleSectionProps> = ({
  title,
  defaultOpen = false,
  statusBadge,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="mt-3">
      <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg bg-muted/50 px-4 py-2.5 text-left transition-colors hover:bg-muted/80">
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
            open ? '' : '-rotate-90'
          }`}
        />
        <span className="text-sm font-semibold">{title}</span>
        {statusBadge && (
          <Badge variant={statusBadge.variant} className="ml-auto px-1.5 py-0.5 text-[10px]">
            {statusBadge.text}
          </Badge>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent className="px-1 pt-1">{children}</CollapsibleContent>
    </Collapsible>
  );
};

// --- ReadOnlyDetailsInline ---

interface DetailItem {
  label: string;
  value: string;
}

interface ReadOnlyDetailsInlineProps {
  details: DetailItem[];
}

export const ReadOnlyDetailsInline: FunctionComponent<ReadOnlyDetailsInlineProps> = ({
  details,
}) => {
  if (!details.length) return null;

  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
      {details.map(({ label, value }) => (
        <div key={label} className="flex flex-col">
          <h4 className="mb-2 text-sm font-medium leading-none text-muted-foreground">{label}</h4>
          <span className="max-w-[35ch] break-all text-sm">{value || 'N/A'}</span>
        </div>
      ))}
    </div>
  );
};

// --- AttributeBadges ---

interface AttributeBadgesProps {
  verified?: string[];
  failed?: string[];
}

const toTitleCase = (str: string) =>
  str
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

export const AttributeBadges: FunctionComponent<AttributeBadgesProps> = ({ verified, failed }) => {
  const hasVerified = verified && verified.length > 0;
  const hasFailed = failed && failed.length > 0;

  if (!hasVerified && !hasFailed) return null;

  return (
    <div className="flex flex-wrap gap-1.5 px-4 pb-3">
      {verified?.map(attr => (
        <span
          key={`v-${attr}`}
          className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 text-xs font-medium text-success"
        >
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
            <path
              d="M10 3L4.5 8.5L2 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {toTitleCase(attr)}
        </span>
      ))}
      {failed?.map(attr => (
        <span
          key={`f-${attr}`}
          className="inline-flex items-center gap-1 rounded-full bg-destructive/15 px-2.5 py-1 text-xs font-medium text-destructive"
        >
          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
            <path
              d="M9 3L3 9M3 3l6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {toTitleCase(attr)}
        </span>
      ))}
    </div>
  );
};

// --- AlertBanner ---

type AlertLevel = 'success' | 'warning' | 'error';

interface AlertBannerProps {
  level: AlertLevel;
  message?: string;
}

const ALERT_CONFIG: Record<
  AlertLevel,
  { bg: string; border: string; text: string; message: string }
> = {
  success: {
    bg: 'bg-success/10',
    border: 'border-success/30',
    text: 'text-success',
    message: 'All verification checks passed',
  },
  warning: {
    bg: 'bg-warning/10',
    border: 'border-warning/30',
    text: 'text-warning',
    message: 'Some checks require manual review',
  },
  error: {
    bg: 'bg-destructive/10',
    border: 'border-destructive/30',
    text: 'text-destructive',
    message: 'One or more checks failed or were rejected',
  },
};

export const AlertBanner: FunctionComponent<AlertBannerProps> = ({ level, message }) => {
  const config = ALERT_CONFIG[level];

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border ${config.border} ${config.bg} mb-3 px-4 py-3`}
    >
      {level === 'success' && (
        <svg className={`h-5 w-5 ${config.text} shrink-0`} viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {level === 'warning' && (
        <svg className={`h-5 w-5 ${config.text} shrink-0`} viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {level === 'error' && (
        <svg className={`h-5 w-5 ${config.text} shrink-0`} viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
            clipRule="evenodd"
          />
        </svg>
      )}
      <span className={`text-sm font-medium ${config.text}`}>{message || config.message}</span>
    </div>
  );
};

// --- Helper: Compute alert level from verification data ---

export const computeAlertLevel = (
  statuses: Array<string | undefined>,
  isDuplicate?: boolean,
): AlertLevel => {
  const hasFailure = statuses.some(s => s === 'REJECTED' || s === 'ERROR');
  const hasReview = statuses.some(s => s === 'REQUIRES_REVIEW');
  const allVerified = statuses.filter(Boolean).every(s => s === 'VERIFIED');

  if (hasFailure || isDuplicate) return 'error';
  if (hasReview) return 'warning';
  if (allVerified && statuses.filter(Boolean).length > 0) return 'success';

  return 'warning';
};
