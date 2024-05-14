import { THit } from '@/lib/blocks/components/AmlBlock/utils/aml-adapter';
import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';
import React, { useMemo } from 'react';
import { buttonVariants } from '@/common/components/atoms/Button/Button';
import dayjs from 'dayjs';

interface IAmlMatchProps {
  match: {
    pep: THit['pep'];
    warnings: THit['warnings'];
    sanctions: THit['sanctions'];
    adverseMedia: THit['adverseMedia'];
    fitnessProbity: THit['fitnessProbity'];
  };
}

export const AmlMatch = ({ match }: IAmlMatchProps) => {
  const orderedTypes = useMemo(
    () => [
      { key: 'pep', accessor: 'person', header: 'PEP' },
      { key: 'warnings', accessor: 'warning', header: 'Warnings' },
      { key: 'sanctions', accessor: 'sanction', header: 'Sanctions' },
      { key: 'adverseMedia', accessor: 'entry', header: 'Adverse Media' },
      { key: 'fitnessProbity', accessor: 'entry', header: 'Fitness Probity' },
    ],
    [],
  );

  return (
    <div className={`flex flex-col gap-y-2`}>
      <div className={`flex gap-x-6 px-4 font-semibold`}>
        <span className={`w-[100px] text-left`}>Type</span>
        <span className={`w-full text-left`}>Source Name</span>
        <span className={`w-[120px] text-left`}>Source URL</span>
        <span className={`w-[150px] text-left`}>Date</span>
      </div>
      {orderedTypes.map(type =>
        match[type.key].map(item => (
          <div key={type.key} className={`flex gap-x-6 px-4`}>
            <span className={`w-[100px] text-left`}>{type.header}</span>
            <TextWithNAFallback className={`w-full text-left`}>
              {item[type.accessor]}
            </TextWithNAFallback>
            <TextWithNAFallback className={`w-[120px] text-left`}>
              {item.source && (
                <a
                  className={buttonVariants({
                    variant: 'link',
                    className: 'h-[unset] cursor-pointer !p-0 !text-blue-500',
                  })}
                  target={'_blank'}
                  rel={'noopener noreferrer'}
                  href={item.source}
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
