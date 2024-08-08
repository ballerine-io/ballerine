import { THit } from '@/lib/blocks/components/AmlBlock/utils/aml-adapter';
import React, { useMemo } from 'react';
import { buttonVariants } from '@/common/components/atoms/Button/Button';
import dayjs from 'dayjs';
import { TextWithNAFallback } from '@ballerine/ui';

interface IAmlMatchProps {
  match: {
    pep: THit['pep'];
    warnings: THit['warnings'];
    sanctions: THit['sanctions'];
    adverseMedia: THit['adverseMedia'];
    fitnessProbity: THit['fitnessProbity'];
    other: THit['other'];
  };
}

export const AmlMatch = ({ match }: IAmlMatchProps) => {
  const orderedTypes = useMemo(
    () => [
      { key: 'pep', header: 'PEP' },
      { key: 'warnings', header: 'Warnings' },
      { key: 'sanctions', header: 'Sanctions' },
      { key: 'adverseMedia', header: 'Adverse Media' },
      { key: 'fitnessProbity', header: 'Fitness Probity' },
      { key: 'other', header: 'Other' },
    ],
    [],
  );

  return (
    <div className={`flex flex-col gap-y-2`}>
      <div className={`flex gap-x-10 px-4 font-semibold`}>
        <span className={`w-[150px] text-left`}>Type</span>
        <span className={`w-full text-left`}>Source Name</span>
        <span className={`w-[150px] text-left`}>Source URL</span>
        <span className={`w-[150px] text-left`}>Date</span>
      </div>
      {orderedTypes.map(type =>
        match[type.key].map((item, index) => (
          <div key={`${type.key}-${index}`} className={`flex gap-x-10 px-4`}>
            <span className={`w-[150px] text-left`}>{type.header}</span>
            <TextWithNAFallback className={`w-full text-left`}>
              {item.sourceName}
            </TextWithNAFallback>
            <TextWithNAFallback className={`w-[150px] text-left`}>
              {item.sourceUrl && (
                <a
                  className={buttonVariants({
                    variant: 'link',
                    className: 'h-[unset] cursor-pointer !p-0 !text-blue-500',
                  })}
                  target={'_blank'}
                  rel={'noopener noreferrer'}
                  href={item.sourceUrl}
                >
                  Link
                </a>
              )}
            </TextWithNAFallback>
            <TextWithNAFallback className={`w-[150px] text-left`}>
              {item.date && dayjs(item.date).format('MMM DD, YYYY')}
            </TextWithNAFallback>
          </div>
        )),
      )}
    </div>
  );
};
