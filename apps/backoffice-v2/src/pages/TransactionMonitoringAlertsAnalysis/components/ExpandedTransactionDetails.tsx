import React from 'react';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { toast } from 'sonner';
import { titleCase } from 'string-ts';
import { FileJson2 } from 'lucide-react';
import getSymbolFromCurrency from 'currency-symbol-map';

import { JsonDialog } from '@ballerine/ui';
import { CopySvg } from '@/common/components/atoms/icons';
import { TTransactionsList } from '@/domains/transactions/fetchers';
import { useEllipsesWithTitle } from '@/common/hooks/useEllipsesWithTitle/useEllipsesWithTitle';
import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';

interface IExpandedTransactionDetailsProps {
  transaction: TTransactionsList[number];
}

const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);

  toast.success(t(`toast:copy_to_clipboard`, { text }));
};

export const ExpandedTransactionDetails = ({ transaction }: IExpandedTransactionDetailsProps) => {
  const { ref, styles } = useEllipsesWithTitle<HTMLSpanElement>();

  return (
    <div className={`flex justify-between px-8`}>
      <div className={`flex space-x-6`}>
        <div className={`flex flex-col justify-between space-y-2 font-bold`}>
          <span>Transaction ID</span>
          <span>Transaction Date</span>
          <span>Transaction Status</span>
          <span>Transaction Type</span>
          <span>Transaction Category</span>
          <span>Amount in Original Currency</span>
          <span>Amount in Base Currency</span>
        </div>
        <div className={`flex max-w-[250px] flex-col justify-between space-y-2`}>
          <div className={`flex space-x-2`}>
            <TextWithNAFallback style={styles} ref={ref}>
              {transaction.transactionCorrelationId}
            </TextWithNAFallback>
            <CopySvg
              className={`h-5 w-5 cursor-pointer opacity-80 hover:opacity-100`}
              onClick={() => copyToClipboard(transaction.transactionCorrelationId)}
            />
          </div>
          <TextWithNAFallback>{`${dayjs(transaction.transactionDate).format(
            'MMM DD, YYYY',
          )} ${dayjs(transaction.transactionDate).format('hh:mm')}`}</TextWithNAFallback>
          <TextWithNAFallback>{titleCase(transaction.transactionStatus ?? '')}</TextWithNAFallback>
          <TextWithNAFallback>{titleCase(transaction.transactionType ?? '')}</TextWithNAFallback>
          <TextWithNAFallback>
            {titleCase(transaction.transactionCategory ?? '')}
          </TextWithNAFallback>
          <TextWithNAFallback>
            {`${getSymbolFromCurrency(transaction.transactionCurrency)} ${
              transaction.transactionAmount
            }`}
          </TextWithNAFallback>
          <TextWithNAFallback>
            {`${getSymbolFromCurrency(transaction.transactionBaseCurrency)} ${
              transaction.transactionBaseAmount
            }`}
          </TextWithNAFallback>
        </div>
      </div>
      <div className={`flex space-x-6`}>
        <div className={`flex flex-col justify-between space-y-2 font-bold`}>
          <span>Transaction Direction</span>
          <span>Payment Method</span>
          <span>Payment Type</span>
          <span>Payment Channel</span>
          <span>Originator IP Address</span>
          <span>Originator Geo Location</span>
          <span>Card Holder Name</span>
        </div>
        <div className={`flex max-w-[250px] flex-col justify-between space-y-2`}>
          <TextWithNAFallback>
            {titleCase(transaction.transactionDirection ?? '')}
          </TextWithNAFallback>
          <TextWithNAFallback>{titleCase(transaction.paymentMethod ?? '')}</TextWithNAFallback>
          <TextWithNAFallback>{titleCase(transaction.paymentType ?? '')}</TextWithNAFallback>
          <TextWithNAFallback>{titleCase(transaction.paymentChannel ?? '')}</TextWithNAFallback>
          <span>{transaction.originatorIpAddress}</span>
          <span>{transaction.originatorGeoLocation}</span>
          <span>{transaction.cardHolderName}</span>
        </div>
      </div>
      <div className={`flex space-x-6`}>
        <div className={`flex max-w-[250px] flex-col justify-between space-y-2 font-bold`}>
          <span>Card BIN</span>
          <span>Card Brand</span>
          <span>Card Issued Country</span>
          <span>Completed 3DS</span>
          <span>Card Type</span>
          <span>Product Name</span>
          <JsonDialog
            buttonProps={{
              variant: 'link',
              className: 'p-0 text-blue-500 max-h-[20px] justify-start',
            }}
            rightIcon={<FileJson2 size={`16`} />}
            dialogButtonText={`View all data`}
            json={JSON.stringify(transaction, null, 2)}
          />
        </div>
        <div className={`flex flex-col justify-between space-y-2`}>
          <TextWithNAFallback>{transaction.cardBin ?? ''}</TextWithNAFallback>
          <TextWithNAFallback>{titleCase(transaction.cardBrand ?? '')}</TextWithNAFallback>
          <TextWithNAFallback>{transaction.cardIssuedCountry}</TextWithNAFallback>
          <TextWithNAFallback>
            {titleCase(transaction.completed3ds ? 'True' : 'False')}
          </TextWithNAFallback>
          <TextWithNAFallback>{titleCase(transaction.cardType ?? '')}</TextWithNAFallback>
          <span>{transaction.productName}</span>
          <span>&nbsp;</span>
        </div>
      </div>
    </div>
  );
};
