import React, { useMemo } from 'react';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { IndicatorCircle } from '@/common/components/atoms/IndicatorCircle/IndicatorCircle';
import { ReadOnlyDetail } from '@/common/components/atoms/ReadOnlyDetail/ReadOnlyDetail';

import { IMerchantScreening } from '@/lib/blocks/hooks/useMerchantScreeningBlock/interfaces';
import {
  inquiredMatchedMerchantsColumns,
  terminatedMatchedMerchantsColumns,
} from '@/lib/blocks/hooks/useMerchantScreeningBlock/columns';
import { toTitleCase } from 'string-ts';
import { formatValue } from '@/lib/blocks/hooks/useMerchantScreeningBlock/format-value';
import { isObject } from '@ballerine/common';
import { ctw } from '@/common/utils/ctw/ctw';

export const useMerchantScreeningBlock = ({
  terminatedMatchedMerchants,
  inquiredMatchedMerchants,
  logoUrl,
}: {
  terminatedMatchedMerchants: IMerchantScreening[];
  inquiredMatchedMerchants: IMerchantScreening[];
  logoUrl: string;
}) => {
  return useMemo(() => {
    if (!terminatedMatchedMerchants?.length && !inquiredMatchedMerchants?.length) {
      return [];
    }

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
                            'h-34': !terminatedMatchedMerchants.length,
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
                        const isEmptyPrincipalMatches = terminatedMatchedMerchant?.principals.every(
                          principal =>
                            Object.keys(principal?.exactMatches).length === 0 &&
                            Object.keys(principal?.partialMatches).length === 0,
                        );
                        const isEmptyUrlMatches = terminatedMatchedMerchant?.principals.every(
                          url =>
                            Object.keys(url?.exactMatches).length === 0 &&
                            Object.keys(url?.partialMatches).length === 0,
                        );

                        return (
                          <div className={`grid grid-cols-2 items-start gap-8`}>
                            <h3 className={`col-span-full mb-4 text-xl font-bold`}>
                              Matching Properties
                            </h3>
                            {!Object.keys(terminatedMatchedMerchant?.exactMatches).length && (
                              <p className={`text-slate-400`}>No matching properties found.</p>
                            )}
                            {!!Object.keys(terminatedMatchedMerchant?.exactMatches).length && (
                              <table className={`w-full max-w-2xl`}>
                                <thead className={`text-left`}>
                                  <tr>
                                    <th className={`pb-1 text-base`}>Merchant Information</th>
                                  </tr>
                                </thead>
                                <tbody className={`text-left`}>
                                  {Object.entries(terminatedMatchedMerchant?.exactMatches).map(
                                    ([key, value]) => (
                                      <tr key={key}>
                                        <th>{toTitleCase(key)}</th>
                                        <td>
                                          <div className={`flex items-center space-x-2`}>
                                            <IndicatorCircle
                                              size={8.9}
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
                                        </td>
                                      </tr>
                                    ),
                                  )}
                                  {Object.entries(terminatedMatchedMerchant?.partialMatches).map(
                                    ([key, value]) => (
                                      <tr key={key}>
                                        <th>{toTitleCase(key)}</th>
                                        <td>
                                          <div className={`flex items-center space-x-2`}>
                                            <IndicatorCircle
                                              size={8.9}
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
                                        </td>
                                      </tr>
                                    ),
                                  )}
                                </tbody>
                              </table>
                            )}
                            {!isEmptyPrincipalMatches &&
                              terminatedMatchedMerchant?.principals.map((principalMatch, index) => {
                                if (
                                  !Object.keys(principalMatch?.exactMatches ?? {}).length &&
                                  !Object.keys(principalMatch?.partialMatches ?? {}).length
                                ) {
                                  return;
                                }

                                return (
                                  <table
                                    className={`w-full max-w-2xl`}
                                    key={`principal-match-${index}`}
                                  >
                                    <thead className={`text-left`}>
                                      <tr>
                                        <th className={`pb-1 text-base`}>Principal {index + 1}</th>
                                      </tr>
                                    </thead>
                                    <tbody className={`text-left`}>
                                      {isObject(principalMatch?.exactMatches) &&
                                        !!Object.keys(principalMatch?.exactMatches).length &&
                                        Object.entries(principalMatch?.exactMatches).map(
                                          ([key, value]) => (
                                            <tr key={key}>
                                              <th>{toTitleCase(key)}</th>
                                              <td>
                                                <div className={`flex items-center space-x-2`}>
                                                  <IndicatorCircle
                                                    size={8.9}
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
                                              </td>
                                            </tr>
                                          ),
                                        )}
                                      {isObject(principalMatch?.partialMatches) &&
                                        !!Object.keys(principalMatch?.partialMatches).length &&
                                        Object.entries(principalMatch?.partialMatches).map(
                                          ([key, value]) => (
                                            <tr key={key}>
                                              <th>{toTitleCase(key)}</th>
                                              <td>
                                                <div className={`flex items-center space-x-2`}>
                                                  <IndicatorCircle
                                                    size={8.9}
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
                                              </td>
                                            </tr>
                                          ),
                                        )}
                                    </tbody>
                                  </table>
                                );
                              })}
                            {!isEmptyUrlMatches &&
                              terminatedMatchedMerchant?.urls.map((urlMatch, index) => {
                                if (
                                  !Object.keys(urlMatch?.exactMatches ?? {}).length &&
                                  !Object.keys(urlMatch?.partialMatches ?? {}).length
                                ) {
                                  return;
                                }

                                return (
                                  <table className={`w-full max-w-2xl`} key={`url-match-${index}`}>
                                    <thead className={`text-left`}>
                                      <tr>
                                        <th className={`pb-1 text-base`}>Url {index + 1}</th>
                                      </tr>
                                    </thead>
                                    <tbody className={`text-left`}>
                                      {isObject(urlMatch?.exactMatches) &&
                                        !!Object.keys(urlMatch?.exactMatches).length &&
                                        Object.entries(urlMatch?.exactMatches).map(
                                          ([key, value]) => (
                                            <tr key={key}>
                                              <td>
                                                <div className={`flex items-center space-x-2`}>
                                                  <IndicatorCircle
                                                    size={8.9}
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
                                              </td>
                                            </tr>
                                          ),
                                        )}
                                      {isObject(urlMatch?.partialMatches) &&
                                        !!Object.keys(urlMatch?.partialMatches).length &&
                                        Object.entries(urlMatch?.partialMatches).map(
                                          ([key, value]) => (
                                            <tr key={key}>
                                              <td>
                                                <div className={`flex items-center space-x-2`}>
                                                  <IndicatorCircle
                                                    size={8.9}
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
                                              </td>
                                            </tr>
                                          ),
                                        )}
                                    </tbody>
                                  </table>
                                );
                              })}
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
                        const isEmptyPrincipalMatches = inquiredMatchedMerchant?.principals.every(
                          principal =>
                            Object.keys(principal?.exactMatches).length === 0 &&
                            Object.keys(principal?.partialMatches).length === 0,
                        );
                        const isEmptyUrlMatches = inquiredMatchedMerchant?.principals.every(
                          url =>
                            Object.keys(url?.exactMatches).length === 0 &&
                            Object.keys(url?.partialMatches).length === 0,
                        );

                        return (
                          <div className={`grid grid-cols-2 items-start gap-8`}>
                            <h3 className={`col-span-full mb-4 text-xl font-bold`}>
                              Matching Properties
                            </h3>
                            <table className={`w-full max-w-2xl`}>
                              <thead className={`text-left`}>
                                <tr>
                                  <th className={`pb-1 text-base`}>Merchant Information</th>
                                </tr>
                              </thead>
                              <tbody className={`text-left`}>
                                {Object.entries(inquiredMatchedMerchant?.exactMatches).map(
                                  ([key, value]) => (
                                    <tr key={key}>
                                      <th>{toTitleCase(key)}</th>
                                      <td>
                                        <div className={`flex items-center space-x-2`}>
                                          <IndicatorCircle
                                            size={8.9}
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
                                      </td>
                                    </tr>
                                  ),
                                )}
                                {Object.entries(inquiredMatchedMerchant?.partialMatches).map(
                                  ([key, value]) => (
                                    <tr key={key}>
                                      <th>{toTitleCase(key)}</th>
                                      <td>
                                        <div className={`flex items-center space-x-2`}>
                                          <IndicatorCircle
                                            size={8.9}
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
                                      </td>
                                    </tr>
                                  ),
                                )}
                              </tbody>
                            </table>
                            {!isEmptyPrincipalMatches &&
                              inquiredMatchedMerchant?.principals.map((principalMatch, index) => {
                                if (
                                  !Object.keys(principalMatch?.exactMatches ?? {}).length &&
                                  !Object.keys(principalMatch?.partialMatches ?? {}).length
                                ) {
                                  return;
                                }

                                return (
                                  <table
                                    className={`w-full max-w-2xl`}
                                    key={`principal-match-${index}`}
                                  >
                                    <thead className={`text-left`}>
                                      <tr>
                                        <th className={`pb-1 text-base`}>Principal {index + 1}</th>
                                      </tr>
                                    </thead>
                                    <tbody className={`text-left`}>
                                      {isObject(principalMatch?.exactMatches) &&
                                        !!Object.keys(principalMatch?.exactMatches).length &&
                                        Object.entries(principalMatch?.exactMatches).map(
                                          ([key, value]) => (
                                            <tr key={key}>
                                              <th>{toTitleCase(key)}</th>
                                              <td>
                                                <div className={`flex items-center space-x-2`}>
                                                  <IndicatorCircle
                                                    size={8.9}
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
                                              </td>
                                            </tr>
                                          ),
                                        )}
                                      {isObject(principalMatch?.partialMatches) &&
                                        !!Object.keys(principalMatch?.partialMatches).length &&
                                        Object.entries(principalMatch?.partialMatches).map(
                                          ([key, value]) => (
                                            <tr key={key}>
                                              <th>{toTitleCase(key)}</th>
                                              <td>
                                                <div className={`flex items-center space-x-2`}>
                                                  <IndicatorCircle
                                                    size={8.9}
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
                                              </td>
                                            </tr>
                                          ),
                                        )}
                                    </tbody>
                                  </table>
                                );
                              })}
                            {!isEmptyUrlMatches &&
                              inquiredMatchedMerchant?.urls.map((urlMatch, index) => {
                                if (
                                  !Object.keys(urlMatch?.exactMatches ?? {}).length &&
                                  !Object.keys(urlMatch?.partialMatches ?? {}).length
                                ) {
                                  return;
                                }

                                return (
                                  <table className={`w-full max-w-2xl`} key={`url-match-${index}`}>
                                    <thead className={`text-left`}>
                                      <tr>
                                        <th className={`pb-1 text-base`}>Url {index + 1}</th>
                                      </tr>
                                    </thead>
                                    <tbody className={`text-left`}>
                                      {isObject(urlMatch?.exactMatches) &&
                                        !!Object.keys(urlMatch?.exactMatches).length &&
                                        Object.entries(urlMatch?.exactMatches).map(
                                          ([key, value]) => (
                                            <tr key={key}>
                                              <td>
                                                <div className={`flex items-center space-x-2`}>
                                                  <IndicatorCircle
                                                    size={8.9}
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
                                              </td>
                                            </tr>
                                          ),
                                        )}
                                      {isObject(urlMatch?.partialMatches) &&
                                        !!Object.keys(urlMatch?.partialMatches).length &&
                                        Object.entries(urlMatch?.partialMatches).map(
                                          ([key, value]) => (
                                            <tr key={key}>
                                              <td>
                                                <div className={`flex items-center space-x-2`}>
                                                  <IndicatorCircle
                                                    size={8.9}
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
                                              </td>
                                            </tr>
                                          ),
                                        )}
                                    </tbody>
                                  </table>
                                );
                              })}
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
