import { IndicatorCircle } from '@/common/components/atoms/IndicatorCircle/IndicatorCircle';
import { ReadOnlyDetail } from '@/common/components/atoms/ReadOnlyDetail/ReadOnlyDetail';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useMemo } from 'react';

import { ctw } from '@/common/utils/ctw/ctw';
import {
  inquiredMatchedMerchantsColumns,
  terminatedMatchedMerchantsColumns,
  terminatedMatchedMerchantsSummaryColumns,
} from '@/lib/blocks/hooks/useMerchantScreeningBlock/columns';
import { formatValue } from '@/lib/blocks/hooks/useMerchantScreeningBlock/format-value';
import { IMerchantScreening } from '@/lib/blocks/hooks/useMerchantScreeningBlock/interfaces';
import { isObject, safeEvery } from '@ballerine/common';
import { JsonDialog } from '@ballerine/ui';
import { toTitleCase } from 'string-ts';

export const useMerchantScreeningBlock = ({
  terminatedMatchedMerchants,
  inquiredMatchedMerchants,
  merchantScreeningInput,
  logoUrl = 'https://cdn.ballerine.io/logos/Mastercard%20logo.svg',
  rawData,
  checkDate,
}: {
  terminatedMatchedMerchants: IMerchantScreening[];
  inquiredMatchedMerchants: IMerchantScreening[];
  merchantScreeningInput: Record<PropertyKey, unknown>;
  logoUrl: string;
  rawData: Record<PropertyKey, unknown>;
  checkDate: string;
}) => {
  return useMemo(() => {
    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'block',
        value: createBlocksTyped()
          .addBlock()
          .addCell({
            type: 'container',
            value: createBlocksTyped()
              .addBlock()
              .addCell({
                type: 'image',
                value: logoUrl,
                props: {
                  width: '40px',
                  height: '40px',
                  className: '[&>figcaption]:sr-only',
                },
              })
              .addCell({
                type: 'heading',
                value: 'MATCH Results',
                props: {
                  className: 'mt-0 p-0',
                },
              })
              .buildFlat(),
            props: {
              className: 'flex space-x-4 items-center my-8',
            },
          })
          .addCell({
            type: 'container',
            value: createBlocksTyped()
              .addBlock()
              .addCell({
                type: 'table',
                value: {
                  columns: terminatedMatchedMerchantsSummaryColumns,
                  data: [
                    {
                      terminatedMatches: terminatedMatchedMerchants?.length ?? 0,
                      numberOfInquiries: inquiredMatchedMerchants?.length ?? 0,
                      checkDate,
                      merchantScreeningInput: merchantScreeningInput ?? {},
                      fullJsonData: rawData ?? {},
                    },
                  ],
                  props: {
                    head: {
                      className: '!ps-0',
                    },
                    cell: {
                      className: '!ps-0',
                    },
                  },
                },
              })
              .buildFlat(),
            props: {
              className: 'mb-16',
            },
          })
          .addCell({
            type: 'container',
            value: createBlocksTyped()
              .addBlock()
              .addCell({
                type: 'container',
                value: createBlocksTyped()
                  .addBlock()
                  .addCell({
                    type: 'subheading',
                    value: 'Terminated Merchants Matches',
                    props: {
                      className: 'ps-0 mb-4 ms-0',
                    },
                  })
                  .addCell({
                    type: 'dataTable',
                    value: {
                      props: {
                        table: {
                          className: 'my-8',
                        },
                        scroll: {
                          className: ctw('h-[26rem]', {
                            'h-34': !terminatedMatchedMerchants?.length,
                          }),
                        },
                      },
                      options: {
                        enableSorting: false,
                      },
                      columns: terminatedMatchedMerchantsColumns,
                      data: terminatedMatchedMerchants,
                      CollapsibleContent: ({
                        row: terminatedMatchedMerchant,
                      }: {
                        row: IMerchantScreening;
                      }) => {
                        const isEmptyPrincipalMatches = safeEvery(
                          terminatedMatchedMerchant?.principals,
                          principal =>
                            Object.keys(principal?.exactMatches ?? {}).length === 0 &&
                            Object.keys(principal?.partialMatches ?? {}).length === 0,
                        );
                        const isEmptyUrlMatches = safeEvery(
                          terminatedMatchedMerchant?.urls,
                          url =>
                            Object.keys(url?.exactMatches ?? {}).length === 0 &&
                            Object.keys(url?.partialMatches ?? {}).length === 0,
                        );

                        return (
                          <div>
                            <div className={`flex items-center justify-between`}>
                              <h3 className={`col-span-full mb-4 text-xl font-bold`}>
                                Matching Properties
                              </h3>
                              <JsonDialog
                                buttonProps={{
                                  variant: 'link',
                                  className: 'p-0 text-blue-500',
                                  disabled:
                                    !isObject(terminatedMatchedMerchant?.raw) &&
                                    !Array.isArray(terminatedMatchedMerchant?.raw ?? {}),
                                }}
                                dialogButtonText={`Full JSON data`}
                                json={JSON.stringify(terminatedMatchedMerchant?.raw ?? {})}
                              />
                            </div>
                            <div className={`flex flex-col space-y-8`}>
                              {!Object.keys(terminatedMatchedMerchant?.exactMatches ?? {})
                                .length && (
                                <p className={`text-slate-400`}>No matching properties found.</p>
                              )}
                              {!!Object.keys(terminatedMatchedMerchant?.exactMatches ?? {})
                                .length && (
                                <ul className={`w-full `}>
                                  <li className={`pb-1 text-base font-semibold`}>
                                    Merchant Information
                                  </li>
                                  <ul className={`grid grid-cols-2 gap-x-4 gap-y-2 xl:grid-cols-3`}>
                                    {Object.entries(terminatedMatchedMerchant?.exactMatches).map(
                                      ([key, value]) => (
                                        <li className={'flex items-center space-x-4'} key={key}>
                                          <span className={`font-semibold`}>
                                            {toTitleCase(key)}
                                          </span>
                                          <div className={`flex items-center space-x-2`}>
                                            <IndicatorCircle
                                              size={11}
                                              className={`fill-destructive stroke-destructive`}
                                            />
                                            <ReadOnlyDetail
                                              parse={{
                                                url: true,
                                                date: true,
                                                datetime: true,
                                                isoDate: true,
                                                nullish: true,
                                              }}
                                            >
                                              {formatValue({ key, value })}
                                            </ReadOnlyDetail>
                                          </div>
                                        </li>
                                      ),
                                    )}
                                    {Object.entries(terminatedMatchedMerchant?.partialMatches).map(
                                      ([key, value]) => (
                                        <li className={'flex items-center space-x-4'} key={key}>
                                          <span className={`font-semibold`}>
                                            {toTitleCase(key)}
                                          </span>
                                          <div className={`flex items-center space-x-2`}>
                                            <IndicatorCircle
                                              size={11}
                                              className={`fill-warning stroke-warning`}
                                            />
                                            <ReadOnlyDetail
                                              parse={{
                                                url: true,
                                                date: true,
                                                datetime: true,
                                                isoDate: true,
                                                nullish: true,
                                              }}
                                            >
                                              {formatValue({ key, value })}
                                            </ReadOnlyDetail>
                                          </div>
                                        </li>
                                      ),
                                    )}
                                  </ul>
                                </ul>
                              )}
                              {!isEmptyPrincipalMatches &&
                                terminatedMatchedMerchant?.principals.map(
                                  (principalMatch, index) => {
                                    if (
                                      !Object.keys(principalMatch?.exactMatches ?? {}).length &&
                                      !Object.keys(principalMatch?.partialMatches ?? {}).length
                                    ) {
                                      return;
                                    }

                                    return (
                                      <ul className={`w-full `} key={`principal-match-${index}`}>
                                        <li className={`pb-1 text-base font-semibold`}>
                                          Principal {index + 1}
                                        </li>
                                        <ul
                                          className={`grid grid-cols-2 gap-x-4 gap-y-2 xl:grid-cols-3`}
                                        >
                                          {isObject(principalMatch?.exactMatches) &&
                                            !!Object.keys(principalMatch?.exactMatches).length &&
                                            Object.entries(principalMatch?.exactMatches).map(
                                              ([key, value]) => (
                                                <li
                                                  className={'flex items-center space-x-4'}
                                                  key={key}
                                                >
                                                  <span className={`font-semibold`}>
                                                    {toTitleCase(key)}
                                                  </span>
                                                  <div className={`flex items-center space-x-2`}>
                                                    <IndicatorCircle
                                                      size={11}
                                                      className={`fill-destructive stroke-destructive`}
                                                    />
                                                    <ReadOnlyDetail
                                                      parse={{
                                                        url: true,
                                                        date: true,
                                                        datetime: true,
                                                        isoDate: true,
                                                        nullish: true,
                                                      }}
                                                    >
                                                      {formatValue({ key, value })}
                                                    </ReadOnlyDetail>
                                                  </div>
                                                </li>
                                              ),
                                            )}
                                          {isObject(principalMatch?.partialMatches) &&
                                            !!Object.keys(principalMatch?.partialMatches).length &&
                                            Object.entries(principalMatch?.partialMatches).map(
                                              ([key, value]) => (
                                                <li
                                                  className={'flex items-center space-x-4'}
                                                  key={key}
                                                >
                                                  <span className={`font-semibold`}>
                                                    {toTitleCase(key)}
                                                  </span>
                                                  <div className={`flex items-center space-x-2`}>
                                                    <IndicatorCircle
                                                      size={11}
                                                      className={`fill-warning stroke-warning`}
                                                    />
                                                    <ReadOnlyDetail
                                                      parse={{
                                                        url: true,
                                                        date: true,
                                                        datetime: true,
                                                        isoDate: true,
                                                        nullish: true,
                                                      }}
                                                    >
                                                      {formatValue({ key, value })}
                                                    </ReadOnlyDetail>
                                                  </div>
                                                </li>
                                              ),
                                            )}
                                        </ul>
                                      </ul>
                                    );
                                  },
                                )}
                              {!isEmptyUrlMatches &&
                                terminatedMatchedMerchant?.urls.map((urlMatch, index) => {
                                  if (
                                    !Object.keys(urlMatch?.exactMatches ?? {}).length &&
                                    !Object.keys(urlMatch?.partialMatches ?? {}).length
                                  ) {
                                    return;
                                  }

                                  return (
                                    <ul className={`w-full `} key={`url-match-${index}`}>
                                      <li className={`pb-1 text-base font-semibold`}>
                                        Url {index + 1}
                                      </li>
                                      <ul
                                        className={`grid grid-cols-2 gap-x-4 gap-y-2 xl:grid-cols-3`}
                                      >
                                        {isObject(urlMatch?.exactMatches) &&
                                          !!Object.keys(urlMatch?.exactMatches).length &&
                                          Object.entries(urlMatch?.exactMatches).map(
                                            ([key, value]) => (
                                              <li
                                                className={'flex items-center space-x-4'}
                                                key={key}
                                              >
                                                <div className={`flex items-center space-x-2`}>
                                                  <IndicatorCircle
                                                    size={11}
                                                    className={`fill-destructive stroke-destructive`}
                                                  />
                                                  <ReadOnlyDetail
                                                    parse={{
                                                      url: true,
                                                      date: true,
                                                      datetime: true,
                                                      isoDate: true,
                                                      nullish: true,
                                                    }}
                                                  >
                                                    {formatValue({ key, value })}
                                                  </ReadOnlyDetail>
                                                </div>
                                              </li>
                                            ),
                                          )}
                                        {isObject(urlMatch?.partialMatches) &&
                                          !!Object.keys(urlMatch?.partialMatches).length &&
                                          Object.entries(urlMatch?.partialMatches).map(
                                            ([key, value]) => (
                                              <li key={key}>
                                                <div className={`flex items-center space-x-2`}>
                                                  <IndicatorCircle
                                                    size={11}
                                                    className={`fill-warning stroke-warning`}
                                                  />
                                                  <ReadOnlyDetail
                                                    parse={{
                                                      url: true,
                                                      date: true,
                                                      datetime: true,
                                                      isoDate: true,
                                                      nullish: true,
                                                    }}
                                                  >
                                                    {formatValue({ key, value })}
                                                  </ReadOnlyDetail>
                                                </div>
                                              </li>
                                            ),
                                          )}
                                      </ul>
                                    </ul>
                                  );
                                })}
                            </div>
                          </div>
                        );
                      },
                    },
                  })
                  .buildFlat(),
              })
              .addCell({
                type: 'container',
                value: createBlocksTyped()
                  .addBlock()
                  .addCell({
                    type: 'subheading',
                    value: 'Inquired Merchants Matches',
                    props: {
                      className: 'ps-0 mb-4 ms-0',
                    },
                  })
                  .addCell({
                    type: 'dataTable',
                    value: {
                      props: {
                        table: {
                          className: 'my-8',
                        },
                        scroll: {
                          className: ctw('h-[26rem]', {
                            'h-34': !inquiredMatchedMerchants.length,
                          }),
                        },
                      },
                      options: {
                        enableSorting: false,
                      },
                      columns: inquiredMatchedMerchantsColumns,
                      data: inquiredMatchedMerchants,
                      CollapsibleContent: ({
                        row: inquiredMatchedMerchant,
                      }: {
                        row: IMerchantScreening;
                      }) => {
                        const isEmptyPrincipalMatches = safeEvery(
                          inquiredMatchedMerchant?.principals,
                          principal =>
                            Object.keys(principal?.exactMatches ?? {}).length === 0 &&
                            Object.keys(principal?.partialMatches ?? {}).length === 0,
                        );
                        const isEmptyUrlMatches = safeEvery(
                          inquiredMatchedMerchant?.urls,
                          url =>
                            Object.keys(url?.exactMatches ?? {}).length === 0 &&
                            Object.keys(url?.partialMatches ?? {}).length === 0,
                        );

                        return (
                          <div>
                            <div className={`flex items-center justify-between`}>
                              <h3 className={`col-span-full mb-4 text-xl font-bold`}>
                                Matching Properties
                              </h3>
                              <JsonDialog
                                buttonProps={{
                                  variant: 'link',
                                  className: 'p-0 text-blue-500',
                                  disabled:
                                    !isObject(inquiredMatchedMerchant?.raw) &&
                                    !Array.isArray(inquiredMatchedMerchant?.raw),
                                }}
                                dialogButtonText={`Full JSON data`}
                                json={JSON.stringify(inquiredMatchedMerchant?.raw ?? {})}
                              />
                            </div>
                            <div className={`flex flex-col space-y-8`}>
                              {!Object.keys(inquiredMatchedMerchant?.exactMatches ?? {}).length && (
                                <p className={`text-slate-400`}>No matching properties found.</p>
                              )}
                              {!!Object.keys(inquiredMatchedMerchant?.exactMatches ?? {})
                                .length && (
                                <ul className={`w-full `}>
                                  <li className={`pb-1 font-semibold`}>Merchant Information</li>
                                  <ul className={`grid grid-cols-2 gap-x-4 gap-y-2 xl:grid-cols-3`}>
                                    {Object.entries(
                                      inquiredMatchedMerchant?.exactMatches ?? {},
                                    ).map(([key, value]) => (
                                      <li className={'flex items-center space-x-4'} key={key}>
                                        <span className={`font-semibold`}>{toTitleCase(key)}</span>
                                        <div className={`flex items-center space-x-2`}>
                                          <IndicatorCircle
                                            size={11}
                                            className={`fill-destructive stroke-destructive`}
                                          />
                                          <ReadOnlyDetail
                                            parse={{
                                              url: true,
                                              date: true,
                                              datetime: true,
                                              isoDate: true,
                                              nullish: true,
                                            }}
                                          >
                                            {formatValue({ key, value })}
                                          </ReadOnlyDetail>
                                        </div>
                                      </li>
                                    ))}
                                    {Object.entries(
                                      inquiredMatchedMerchant?.partialMatches ?? {},
                                    ).map(([key, value]) => (
                                      <li className={'flex items-center space-x-4'} key={key}>
                                        <span className={`font-semibold`}>{toTitleCase(key)}</span>
                                        <div className={`flex items-center space-x-2`}>
                                          <IndicatorCircle
                                            size={11}
                                            className={`fill-warning stroke-warning`}
                                          />
                                          <ReadOnlyDetail
                                            parse={{
                                              url: true,
                                              date: true,
                                              datetime: true,
                                              isoDate: true,
                                              nullish: true,
                                            }}
                                          >
                                            {formatValue({ key, value })}
                                          </ReadOnlyDetail>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </ul>
                              )}
                              {!isEmptyPrincipalMatches &&
                                inquiredMatchedMerchant?.principals.map((principalMatch, index) => {
                                  if (
                                    !Object.keys(principalMatch?.exactMatches ?? {}).length &&
                                    !Object.keys(principalMatch?.partialMatches ?? {}).length
                                  ) {
                                    return;
                                  }

                                  return (
                                    <ul className={`w-full `} key={`principal-match-${index}`}>
                                      <li className={`pb-1 font-semibold`}>
                                        Principal {index + 1}
                                      </li>

                                      <ul
                                        className={`grid grid-cols-2 gap-x-4 gap-y-2 xl:grid-cols-3`}
                                      >
                                        {isObject(principalMatch?.exactMatches) &&
                                          !!Object.keys(principalMatch?.exactMatches).length &&
                                          Object.entries(principalMatch?.exactMatches).map(
                                            ([key, value]) => (
                                              <li
                                                className={'flex items-center space-x-4'}
                                                key={key}
                                              >
                                                <span className={`font-semibold`}>
                                                  {toTitleCase(key)}
                                                </span>
                                                <div className={`flex items-center space-x-2`}>
                                                  <IndicatorCircle
                                                    size={11}
                                                    className={`fill-destructive stroke-destructive`}
                                                  />
                                                  <ReadOnlyDetail
                                                    parse={{
                                                      url: true,
                                                      date: true,
                                                      datetime: true,
                                                      isoDate: true,
                                                      nullish: true,
                                                    }}
                                                  >
                                                    {formatValue({ key, value })}
                                                  </ReadOnlyDetail>
                                                </div>
                                              </li>
                                            ),
                                          )}
                                        {isObject(principalMatch?.partialMatches) &&
                                          !!Object.keys(principalMatch?.partialMatches).length &&
                                          Object.entries(principalMatch?.partialMatches).map(
                                            ([key, value]) => (
                                              <li
                                                className={'flex items-center space-x-4'}
                                                key={key}
                                              >
                                                <span className={`font-semibold`}>
                                                  {toTitleCase(key)}
                                                </span>
                                                <div className={`flex items-center space-x-2`}>
                                                  <IndicatorCircle
                                                    size={11}
                                                    className={`fill-warning stroke-warning`}
                                                  />
                                                  <ReadOnlyDetail
                                                    parse={{
                                                      url: true,
                                                      date: true,
                                                      datetime: true,
                                                      isoDate: true,
                                                      nullish: true,
                                                    }}
                                                  >
                                                    {formatValue({ key, value })}
                                                  </ReadOnlyDetail>
                                                </div>
                                              </li>
                                            ),
                                          )}
                                      </ul>
                                    </ul>
                                  );
                                })}
                              {!isEmptyUrlMatches &&
                                inquiredMatchedMerchant?.urls?.map((urlMatch, index) => {
                                  if (
                                    !Object.keys(urlMatch?.exactMatches ?? {}).length &&
                                    !Object.keys(urlMatch?.partialMatches ?? {}).length
                                  ) {
                                    return;
                                  }

                                  return (
                                    <ul className={`w-full `} key={`url-match-${index}`}>
                                      <li className={`pb-1 font-semibold`}>Url {index + 1}</li>

                                      <ul
                                        className={`grid grid-cols-2 gap-x-4 gap-y-2 xl:grid-cols-3`}
                                      >
                                        {isObject(urlMatch?.exactMatches) &&
                                          !!Object.keys(urlMatch?.exactMatches).length &&
                                          Object.entries(urlMatch?.exactMatches).map(
                                            ([key, value]) => (
                                              <li key={key}>
                                                <div className={`flex items-center space-x-2`}>
                                                  <IndicatorCircle
                                                    size={11}
                                                    className={`fill-destructive stroke-destructive`}
                                                  />
                                                  <ReadOnlyDetail
                                                    parse={{
                                                      url: true,
                                                      date: true,
                                                      datetime: true,
                                                      isoDate: true,
                                                      nullish: true,
                                                    }}
                                                  >
                                                    {formatValue({ key, value })}
                                                  </ReadOnlyDetail>
                                                </div>
                                              </li>
                                            ),
                                          )}
                                        {isObject(urlMatch?.partialMatches) &&
                                          !!Object.keys(urlMatch?.partialMatches).length &&
                                          Object.entries(urlMatch?.partialMatches).map(
                                            ([key, value]) => (
                                              <li key={key}>
                                                <div className={`flex items-center space-x-2`}>
                                                  <IndicatorCircle
                                                    size={11}
                                                    className={`fill-warning stroke-warning`}
                                                  />
                                                  <ReadOnlyDetail
                                                    parse={{
                                                      url: true,
                                                      date: true,
                                                      datetime: true,
                                                      isoDate: true,
                                                      nullish: true,
                                                    }}
                                                  >
                                                    {formatValue({ key, value })}
                                                  </ReadOnlyDetail>
                                                </div>
                                              </li>
                                            ),
                                          )}
                                      </ul>
                                    </ul>
                                  );
                                })}
                            </div>
                          </div>
                        );
                      },
                    },
                  })
                  .buildFlat(),
              })
              .buildFlat(),
            props: {
              className: 'flex flex-col space-y-6',
            },
          })
          .buildFlat(),
      })
      .build();
  }, [inquiredMatchedMerchants, logoUrl, terminatedMatchedMerchants]);
};
