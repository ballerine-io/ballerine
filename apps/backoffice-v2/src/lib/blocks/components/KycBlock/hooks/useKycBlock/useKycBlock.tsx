import { isObject, TDocument, valueOrNA } from '@ballerine/common';
import { ComponentProps, useCallback, useMemo, useState } from 'react';

import { Separator } from '@/common/components/atoms/Separator/Separator';
import { MotionButton } from '@/common/components/molecules/MotionButton/MotionButton';
import { ctw } from '@/common/utils/ctw/ctw';
import { useKycDocumentsAdapter } from '@/domains/documents/hooks/adapters/useKycDocumentsAdapter/useKycDocumentsAdapter';
import { useAmlBlock } from '@/lib/blocks/components/AmlBlock/hooks/useAmlBlock/useAmlBlock';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { motionButtonProps } from '@/lib/blocks/hooks/useAssosciatedCompaniesBlock/useAssociatedCompaniesBlock';
import { useCaseDecision } from '@/pages/Entity/components/Case/hooks/useCaseDecision/useCaseDecision';
import { omitPropsFromObject } from '@/pages/Entity/hooks/useEntityLogic/utils';
import {
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
} from '@ballerine/ui';
import { MotionBadge } from '../../../../../../common/components/molecules/MotionBadge/MotionBadge';
import { capitalize } from '../../../../../../common/utils/capitalize/capitalize';
import { PlayCircle, Send } from 'lucide-react';
import { ExtendedJson } from '@/common/types';
import { Select } from '@/common/components/atoms/Select/Select';
import { SelectContent } from '@/common/components/atoms/Select/Select.Content';
import { SelectItem } from '@/common/components/atoms/Select/Select.Item';
import { SelectTrigger } from '@/common/components/atoms/Select/Select.Trigger';
import { SelectValue } from '@/common/components/atoms/Select/Select.Value';

const motionBadgeProps = {
  exit: { opacity: 0, transition: { duration: 0.2 } },
  initial: { y: 10, opacity: 0 },
  transition: { type: 'spring', bounce: 0.3 },
  animate: { y: 0, opacity: 1, transition: { duration: 0.2 } },
} satisfies ComponentProps<typeof MotionBadge>;

const RISK_TO_LABEL = {
  none: 'None',
  allowedAge: 'Disallowed age',
  faceLiveness: 'Face is not lively',
  documentNotExpired: 'Document expired',
  geolocationMatch: 'No geolocation match',
  documentAccepted: 'Document not accepted',
  faceNotInBlocklist: 'Face is in blocklist',
  allowedIpLocation: 'Disallowed IP location',
  faceImageAvailable: 'Face image unavailable',
  documentRecognised: 'Document not recognized',
  faceSimilarToPortrait: 'Face not similar to portrait',
  validDocumentAppearance: 'Invalid document appearance',
  expectedTrafficBehaviour: 'Unexpected traffic behavior',
  physicalDocumentPresent: 'Physical document not present',
  documentBackFullyVisible: 'Document back not fully visible',
  documentFrontFullyVisible: 'Document front not fully visible',
  documentBackImageAvailable: 'Document back image unavailable',
  faceImageQualitySufficient: 'Face image quality insufficient',
  documentFrontImageAvailable: 'Document front image unavailable',
  documentImageQualitySufficient: 'Document image quality insufficient',
} as const;

export const useKycBlock = ({
  onInitiateKyc,
  onInitiateSanctionsScreening,
  onApprove,
  onReuploadNeeded,
  documents: passedDocuments,
  kycSession,
  aml,
  entityData,
  status,
  isActionsDisabled,
  isLoadingReuploadNeeded,
  isLoadingApprove,
  isInitiateKycDisabled,
  isInitiateSanctionsScreeningDisabled,
  isApproveDisabled,
  isReuploadNeededDisabled,
  reasons,
}: {
  onInitiateKyc: () => void;
  onInitiateSanctionsScreening: () => void;
  onApprove: ({ ids }: { ids: string[] }) => () => void;
  onReuploadNeeded: ({ reason, ids }: { reason: string; ids: string[] }) => () => void;
  documents: TDocument[];
  kycSession: Record<
    string,
    {
      vendor: string;
      decision: {
        status: string;
        riskLabels: string[];
      };
      result:
        | {
            entity: {
              data: Record<string, ExtendedJson>;
            };
            aml: {
              vendor: string;
            };
            documents: TDocument[];
            decision: {
              status: string;
              riskLabels: string[];
            };
          }
        | {
            vendorResult: {
              aml: {
                vendor: string;
              };
            };
            documents: TDocument[];
          };
    }
  >;
  aml: {
    vendor: string;
  };
  entityData: Record<string, ExtendedJson>;
  status: 'revision' | 'approved' | 'rejected' | 'pending' | undefined;
  isActionsDisabled: boolean;
  isLoadingReuploadNeeded: boolean;
  isLoadingApprove: boolean;
  isInitiateKycDisabled: boolean;
  isInitiateSanctionsScreeningDisabled: boolean;
  isApproveDisabled: boolean;
  isReuploadNeededDisabled: boolean;
  reasons: string[];
}) => {
  const noReasons = !reasons?.length;
  const [reason, setReason] = useState(reasons?.[0] ?? '');
  const [comment, setComment] = useState('');
  const reasonWithComment = comment ? `${reason} - ${comment}` : reason;
  const onReasonChange = useCallback((value: string) => setReason(value), [setReason]);
  const onCommentChange = useCallback((value: string) => setComment(value), [setComment]);

  const { noAction } = useCaseDecision();
  const kycSessionKeys = Object.keys(kycSession ?? {});

  const { documents: allDocuments, isLoading: isLoadingDocuments } = useKycDocumentsAdapter({
    documents: passedDocuments ?? [],
  });

  const documents = useMemo(() => {
    return allDocuments?.filter(document => document.type === 'identification_document') ?? [];
  }, [allDocuments]);

  const nonIdentificationDocumentsIds = useMemo(() => {
    return (
      documents
        // 'identification_document' is exclusive to Veriff
        ?.filter(document => document.type !== 'identification_document')
        ?.map(document => document.id) ?? []
    );
  }, [documents]);

  const riskLabels = kycSessionKeys?.length
    ? kycSessionKeys.flatMap(key => {
        if (!kycSession[key]?.result?.decision?.riskLabels?.length) {
          return 'none';
        }

        return kycSession[key]?.result?.decision?.riskLabels;
      })
    : [];

  const decision = kycSessionKeys?.length
    ? kycSessionKeys?.flatMap(key => [
        {
          label: 'Verified With',
          value: capitalize(kycSession[key]?.vendor ?? ''),
        },
        {
          label: 'Result',
          value: kycSession[key]?.result?.decision?.status,
          props: {
            className: ctw({
              'text-success': kycSession[key]?.result?.decision?.status === 'approved',
              'text-destructive': kycSession[key]?.result?.decision?.status === 'rejected',
              'font-bold':
                kycSession[key]?.result?.decision?.status === 'approved' ||
                kycSession[key]?.result?.decision?.status === 'rejected',
            }),
          },
        },
        {
          label: 'Issues',
          value: kycSession[key]?.decision?.riskLabels?.length
            ? kycSession[key]?.decision?.riskLabels?.join(', ')
            : 'none',
        },
        ...(isObject(kycSession[key])
          ? [
              {
                label: 'Full report',
                value: kycSession[key],
              },
            ]
          : []),
      ]) ?? []
    : [];

  const amlData = useMemo(() => {
    if (!Object.keys(aml ?? {}).length && !kycSessionKeys?.length) {
      return [];
    }

    if (aml) {
      return [aml];
    }

    return kycSessionKeys.map(
      key => kycSession[key]?.result?.vendorResult?.aml ?? kycSession[key]?.result?.aml,
    );
  }, [kycSession, kycSessionKeys]);
  const vendor = useMemo(() => {
    if (aml) {
      return aml.vendor;
    }

    if (!kycSessionKeys?.length) {
      return;
    }

    const amlVendor = kycSessionKeys
      .map(
        key =>
          kycSession[key]?.result?.vendorResult?.aml?.vendor ??
          kycSession[key]?.result?.aml?.vendor,
      )
      .filter(Boolean);

    if (!amlVendor.length) {
      const kycVendor = kycSessionKeys.map(key => kycSession[key]?.vendor).filter(Boolean);

      return kycVendor.join(', ');
    }

    return amlVendor.join(', ');
  }, [kycSession, kycSessionKeys]);

  const amlBlock = useAmlBlock({
    data: amlData,
    vendor: vendor ?? '',
  });

  const documentExtractedData = kycSessionKeys?.length
    ? kycSessionKeys?.map((key, index, collection) =>
        createBlocksTyped()
          .addBlock()
          .addCell({
            type: 'readOnlyDetails',
            value: Object.entries({
              ...kycSession[key]?.result?.entity?.data,
              ...omitPropsFromObject(kycSession[key]?.result?.documents?.[0]?.properties, 'issuer'),
              issuer: kycSession[key]?.result?.documents?.[0]?.issuer?.country,
            })?.map(([label, value]) => ({
              label,
              value: value as ExtendedJson,
            })),
            props: {
              config: {
                parse: {
                  boolean: true,
                  date: true,
                  datetime: true,
                  isoDate: true,
                  nullish: true,
                  url: true,
                },
              },
            },
          })
          .addCell({
            type: 'node',
            value: index !== collection.length - 1 && <Separator className={`my-2`} />,
          })
          .buildFlat(),
      ) ?? []
    : [];

  const isDisabled = isActionsDisabled || noAction || isLoadingApprove || isLoadingReuploadNeeded;

  const getDecisionStatusOrAction = (
    status: 'revision' | 'approved' | 'rejected' | 'pending' | undefined,
  ) => {
    const badgeClassNames = 'text-sm font-bold';

    if (status === 'revision') {
      return createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'badge',
          value: 'Pending re-upload',
          props: {
            ...motionBadgeProps,
            variant: 'warning',
            className: badgeClassNames,
          },
        })
        .buildFlat();
    }

    if (status === 'approved') {
      return createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'badge',
          value: 'Approved',
          props: {
            ...motionBadgeProps,
            variant: 'success',
            className: `${badgeClassNames} bg-success/20`,
          },
        })
        .buildFlat();
    }

    if (status === 'rejected') {
      return createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'badge',
          value: 'Rejected',
          props: {
            ...motionBadgeProps,
            variant: 'destructive',
            className: badgeClassNames,
          },
        })
        .buildFlat();
    }

    if (status === 'pending') {
      return createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'badge',
          value: 'Pending ID verification',
          props: {
            ...motionBadgeProps,
            variant: 'warning',
            className: badgeClassNames,
          },
        })
        .buildFlat();
    }

    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'dialog',
        value: {
          title: 'Ask to re-upload',
          trigger: (
            <MotionButton
              {...motionButtonProps}
              animate={{
                ...motionButtonProps.animate,
                opacity: isDisabled ? 0.5 : motionButtonProps.animate.opacity,
              }}
              size="wide"
              variant="warning"
              disabled={isDisabled || isReuploadNeededDisabled}
            >
              Re-upload needed
            </MotionButton>
          ),
          description: (
            <>
              <span className="mb-[10px] block">
                By clicking the button below, an email with a link will be sent to the customer,
                directing them to re-upload the documents you have marked as “re-upload needed”.
              </span>
              <span>
                The case’s status will then change to “Revisions” until the customer will provide
                the needed documents and fixes.
              </span>
            </>
          ),
          content: (
            <>
              {!noReasons && (
                <div>
                  <label className={`mb-2 block font-bold`} htmlFor={`reason`}>
                    Reason
                  </label>
                  <Select onValueChange={onReasonChange} value={reason}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reasons?.map(reason => {
                        const reasonWithSpace = reason.replace(/_/g, ' ').toLowerCase();
                        const capitalizedReason = capitalize(reasonWithSpace);

                        return (
                          <SelectItem key={reason} value={reason} className={`capitalize`}>
                            {capitalizedReason}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <label className={`mb-2 block font-bold`} htmlFor={`comment`}>
                  {noReasons ? 'Reason' : 'Comment'}
                </label>
                <Input
                  onChange={event => {
                    if (noReasons) {
                      onReasonChange(event.target.value);

                      return;
                    }

                    onCommentChange(event.target.value);
                  }}
                  value={noReasons ? reason : comment}
                  id={noReasons ? `reason` : `comment`}
                />
              </div>
            </>
          ),
          close: (
            <Button
              className={ctw(`gap-x-2 !bg-foreground`, {
                loading: isLoadingReuploadNeeded,
              })}
              disabled={isLoadingReuploadNeeded || isReuploadNeededDisabled}
              onClick={onReuploadNeeded({
                reason: reasonWithComment,
                ids: nonIdentificationDocumentsIds,
              })}
            >
              <Send size={18} />
              Send email
            </Button>
          ),
        },
      })
      .addCell({
        type: 'dialog',
        value: {
          trigger: (
            <MotionButton
              {...motionButtonProps}
              animate={{
                ...motionButtonProps.animate,
                opacity: isDisabled ? 0.5 : motionButtonProps.animate.opacity,
              }}
              disabled={isDisabled || isApproveDisabled}
              size={'wide'}
              variant={'success'}
              className={'enabled:bg-success enabled:hover:bg-success/90'}
            >
              Approve
            </MotionButton>
          ),
          title: `Approval confirmation`,
          description: <p className={`text-sm`}>Are you sure you want to approve?</p>,
          content: null,
          close: (
            <div className={`space-x-2`}>
              <Button type={'button'} variant={`secondary`}>
                Cancel
              </Button>
              <Button
                disabled={isDisabled || isApproveDisabled}
                onClick={onApprove({ ids: nonIdentificationDocumentsIds })}
              >
                Approve
              </Button>
            </div>
          ),
          props: {
            content: {
              className: 'mb-96',
            },
            title: {
              className: `text-2xl`,
            },
          },
        },
      })
      .buildFlat();
  };

  const headerCell = createBlocksTyped()
    .addBlock()
    .addCell({
      id: 'header',
      type: 'container',
      props: {
        className: 'justify-between items-center pt-6',
      },
      value: createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'heading',
          value: `${valueOrNA(entityData?.firstName)} ${valueOrNA(entityData?.lastName)}`,
          props: {
            className: 'mt-0',
          },
        })
        .addCell({
          type: 'node',
          value: (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={
                    'ms-auto px-2 py-0 text-xs aria-disabled:pointer-events-none aria-disabled:opacity-50'
                  }
                >
                  Options
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className={`h-6 w-full`} asChild>
                  <Button
                    variant={'ghost'}
                    className="justify-start text-xs leading-tight aria-disabled:pointer-events-none aria-disabled:opacity-50"
                    onClick={onInitiateKyc}
                    disabled={isInitiateKycDisabled}
                  >
                    <PlayCircle size={16} className="me-2" /> Initiate KYC
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuItem className={`h-6 w-full`} asChild>
                  <Button
                    variant={'ghost'}
                    className="justify-start text-xs leading-tight aria-disabled:pointer-events-none aria-disabled:opacity-50"
                    onClick={onInitiateSanctionsScreening}
                    disabled={isInitiateSanctionsScreeningDisabled}
                  >
                    <PlayCircle size={16} className="me-2" /> Initiate Sanctions Screening
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ),
        })
        .buildFlat(),
    })
    .cellAt(0, 0);

  return createBlocksTyped()
    .addBlock()
    .addCell({
      type: 'block',
      value: createBlocksTyped()
        .addBlock()
        .addCell(headerCell)
        .addCell({
          type: 'node',
          value: <Separator className={`my-2`} />,
        })
        .addCell({
          id: 'title-with-actions',
          type: 'container',
          props: { className: 'mt-2' },
          value: createBlocksTyped()
            .addBlock()
            .addCell({
              type: 'heading',
              value: 'Identity Verification Results',
              props: {
                className: 'mt-0',
              },
            })
            .addCell({
              type: 'container',
              props: { className: 'space-x-4' },
              value: getDecisionStatusOrAction(status),
            })
            .buildFlat(),
        })
        .addCell({
          id: 'kyc-block',
          type: 'container',
          value: createBlocksTyped()
            .addBlock()
            .addCell({
              type: 'container',
              value: createBlocksTyped()
                .addBlock()
                .addCell({
                  type: 'container',
                  value: createBlocksTyped()
                    .addBlock()
                    .addCell({
                      id: 'header',
                      type: 'heading',
                      value: 'Details',
                    })
                    .addCell({
                      type: 'readOnlyDetails',
                      value: Object.entries(entityData ?? {}).map(([label, value]) => ({
                        label,
                        value,
                      })),
                      props: {
                        config: {
                          parse: {
                            boolean: true,
                            date: true,
                            datetime: true,
                            isoDate: true,
                            nullish: true,
                            url: true,
                          },
                        },
                      },
                    })
                    .buildFlat(),
                })
                .addCell({
                  type: 'container',
                  value: documentExtractedData.length
                    ? createBlocksTyped()
                        .addBlock()
                        .addCell({
                          id: 'header',
                          type: 'heading',
                          value: 'Document Extracted Data',
                        })
                        .build()
                        .concat(documentExtractedData)
                        .flat(1)
                    : createBlocksTyped()
                        .addBlock()
                        .addCell({
                          type: 'heading',
                          value: 'Document Extracted Data',
                        })
                        .addCell({
                          type: 'paragraph',
                          value: 'Initiate KYC for document extracted data to appear',
                          props: {
                            className: 'py-4 text-slate-500',
                          },
                        })
                        .buildFlat(),
                })
                .addCell({
                  type: 'container',
                  value: decision.length
                    ? createBlocksTyped()
                        .addBlock()
                        .addCell({
                          id: 'header',
                          type: 'heading',
                          value: 'Document Verification Results',
                        })
                        .addCell({
                          type: 'readOnlyDetails',
                          value: decision,
                          props: {
                            config: {
                              sort: {
                                predefinedOrder: ['Result', 'Verified With', 'Full report'],
                              },
                              parse: {
                                boolean: true,
                                date: true,
                                datetime: true,
                                isoDate: true,
                                nullish: true,
                                url: true,
                              },
                            },
                          },
                        })
                        .addCell({
                          type: 'node',
                          value: (
                            <div className="m-2 mt-4 flex flex-col gap-4 p-1">
                              <p className="text-sm font-medium">Issues</p>
                              <div className="flex flex-col space-y-4">
                                {riskLabels.map(item => (
                                  <Badge
                                    key={item}
                                    variant={item === 'none' ? 'success' : 'destructive'}
                                    className={`max-w-fit text-sm font-bold`}
                                  >
                                    {RISK_TO_LABEL[item as keyof typeof RISK_TO_LABEL] ?? item}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ),
                        })
                        .buildFlat()
                    : createBlocksTyped()
                        .addBlock()
                        .addCell({
                          type: 'heading',
                          value: 'Document Verification Results',
                        })
                        .addCell({
                          type: 'paragraph',
                          value: 'Initiate KYC for document verification results to appear',
                          props: {
                            className: 'py-4 text-slate-500',
                          },
                        })
                        .buildFlat(),
                })
                .buildFlat(),
            })
            .addCell({
              type: 'multiDocuments',
              value: {
                isLoading: isLoadingDocuments,
                data: documents?.flatMap(document => document?.details),
              },
            })
            .buildFlat(),
        })
        .addCell({
          type: 'node',
          value: <Separator className={`my-2`} />,
        })
        .addCell({
          type: 'container',
          value: amlBlock,
        })
        .buildFlat(),
      props: {
        className: ctw({
          'shadow-[0_4px_4px_0_rgba(174,174,174,0.0625)] border-[1px] border-warning':
            status === 'revision',
        }),
      },
    })
    .build();
};
