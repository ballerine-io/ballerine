import { isNullish } from '@ballerine/common';
import { WarningAlert } from '../../../../common/components/atoms/WarningAlert';
import { DataField } from '../../../../common/components/molecules/DataField/DataField';
import { DetailsGrid } from '../../../../common/components/molecules/DetailsGrid/DetailsGrid';
import { Modal } from '../../../../common/components/organisms/Modal/Modal';
import { IInfoProps } from './interfaces';
import { useToggle } from '../../../../common/hooks/useToggle/useToggle';
import { FunctionComponent, useCallback, useState } from 'react';
import { State } from '../../../../common/enums';
import { camelCaseToSpace } from '../../../../common/utils/camel-case-to-space/camel-case-to-space';
import { createArrayOfNumbers } from '../../../../common/utils/create-array-of-numbers/create-array-of-numbers';
import { ctw } from '../../../../common/utils/ctw/ctw';
import { formatDate } from '../../../../common/utils/format-date';
import { isValidDate } from '../../../../common/utils/is-valid-date';
import { toStartCase } from '../../../../common/utils/to-start-case/to-start-case';

export const useInfo = ({
  whitelist = [],
  info,
  isLoading,
}: {
  whitelist: Array<string>;
  info: Record<PropertyKey, unknown>;
  isLoading?: boolean;
}) => {
  const [isOcrMismatch, setIsOcrMismatch] = useState(true);
  const onOcrMismatch = useCallback(() => setIsOcrMismatch(prev => !prev), []);
  const skeletons = createArrayOfNumbers(2);
  const sections = isLoading
    ? skeletons
    : whitelist?.reduce((acc, key) => {
        const section = info[key] ?? {};

        // Don't render sections with no title
        if (Object.keys(section).length === 0) return acc;

        const data = Object.entries(section).reduce((acc, [key, value]) => {
          // Don't render empty fields
          if (isNullish(value) || value === '') return acc;

          acc[key] = value;

          return acc;
        }, {});

        // Don't render sections with a title but no fields
        if (Object.values(data).length === 0) return acc;

        acc.push({
          title: toStartCase(camelCaseToSpace(key)),
          data,
        });

        return acc;
      }, []) ?? [];
  const [
    isViewFullReportModalOpen,
    toggleIsViewFullReportModalOpen,
    toggleOnIsViewFullReportModalOpen,
  ] = useToggle();
  const onToggleOnIsViewFullReportOpen = useCallback(() => {
    toggleOnIsViewFullReportModalOpen();
  }, [toggleOnIsViewFullReportModalOpen]);

  return {
    sections,
    skeletons,
    isOcrMismatch,
    onOcrMismatch,
    onToggleOnIsViewFullReportOpen,
    isViewFullReportModalOpen,
    toggleIsViewFullReportModalOpen,
  };
};

/**
 * @description To be used by {@link Case}, and be wrapped by {@link Case.Content}. Displays a single entity's personal information and verification status using {@link DetailsGrid} and {@link DataField}.
 *
 * @see {@link DetailsGrid}
 * @see {@link DataField}
 *
 * @param props
 * @param props.personalInfo - Information such as first name, email, phone.
 * @param props.passportInfo - Contains the passport type, issue date, etc.
 * @param props.checkResults - The verification status of the entity (i.e. rejected, approved, processing).
 *
 * @constructor
 */
export const Info: FunctionComponent<IInfoProps> = ({ info, whitelist, isLoading }) => {
  const {
    sections,
    skeletons,
    isOcrMismatch,
    onOcrMismatch,
    isViewFullReportModalOpen,
    onToggleOnIsViewFullReportOpen,
    toggleIsViewFullReportModalOpen,
  } = useInfo({
    info,
    whitelist,
    isLoading,
  });

  return (
    <div className={`space-y-8 p-4`}>
      {isLoading
        ? skeletons.map(index => (
            <DetailsGrid
              key={`details-grid-skeleton-${index}`}
              title={''}
              data={{}}
              loading={{
                title: true,
                data: true,
              }}
            >
              {() => null}
            </DetailsGrid>
          ))
        : sections?.map(section => (
            <DetailsGrid
              key={section?.title}
              title={section?.title}
              data={section?.data}
              footer={
                /personal\sinfo/i.test(section?.title) && (
                  // Can use dialog here once browser support is better
                  <WarningAlert
                    // isOpen={isOcrMismatch}
                    isOpen={false}
                    className={`text-base-content theme-dark:text-base-100`}
                  >
                    <div className={`flex w-full justify-between`}>
                      OCR & Given details mismatch
                      <button className={`link link-hover rounded-md p-1`} onClick={onOcrMismatch}>
                        Resolve
                      </button>
                    </div>
                  </WarningAlert>
                )
              }
            >
              {({ title, text, index }) => {
                const value = isValidDate(text) ? formatDate(new Date(text)) : text;
                const isCheckResults = /check\sresults/i.test(section?.title);
                const isEmail = /email/i.test(title);

                if (index === 2 && isCheckResults) {
                  return (
                    <>
                      <Modal
                        title={`View full report modal`}
                        isOpen={isViewFullReportModalOpen}
                        onIsOpenChange={toggleIsViewFullReportModalOpen}
                        hideTitle
                      >
                        <pre
                          className={`mx-auto w-full max-w-4xl rounded-md bg-base-content p-4 text-base-100`}
                        >
                          <code>
                            {JSON.stringify(
                              sections?.reduce((acc, curr) => {
                                // Convert titles back to camelCase from Start case.
                                const title = curr?.title
                                  ?.toLowerCase()
                                  ?.replace(/\s[a-z]/g, match =>
                                    match?.toUpperCase()?.replace(/\s/, ''),
                                  );

                                acc[title] = curr?.data;

                                return acc;
                              }, {}),
                              null,
                              2,
                            )}
                          </code>
                        </pre>
                      </Modal>
                      <button
                        className={`link link-hover link-primary rounded-md`}
                        onClick={onToggleOnIsViewFullReportOpen}
                      >
                        View full report
                      </button>
                    </>
                  );
                }

                return (
                  <DataField
                    title={title}
                    // camelCase to Title Case
                    text={value.replace(/([a-z])([A-Z])/g, '$1 $2')}
                    textProps={{
                      className: ctw({
                        capitalize: !isEmail,
                        'normal-case': isEmail,
                        'text-success': isCheckResults && text === State.APPROVED,
                        'text-error': isCheckResults && text === State.REJECTED,
                      }),
                    }}
                  />
                );
              }}
            </DetailsGrid>
          ))}
    </div>
  );
};
