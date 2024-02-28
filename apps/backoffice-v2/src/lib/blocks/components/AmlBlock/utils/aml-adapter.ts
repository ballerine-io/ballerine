interface IAmlAdapterParams {
  hits: Array<{
    matchedName: string;
    dateOfBirth: string;
    countries: string[];
    matchTypes: string[];
    aka: string[];
    listingsRelatedToMatch: {
      warnings: Array<{
        sourceName: string;
        sourceUrl: string;
        date: string;
      }>;
      sanctions: Array<{
        sourceName: string;
        sourceUrl: string;
        date: string;
      }>;
      pep: Array<{
        sourceName: string;
        sourceUrl: string;
        date: string;
      }>;
      adverseMedia: Array<{
        sourceName: string;
        sourceUrl: string;
        date: string;
      }>;
    };
  }>;
  createdAt: string;
  totalHits: number;
}

export const amlAdapter = (aml: IAmlAdapterParams) => {
  const { hits, totalHits, createdAt, ...rest } = aml;

  return {
    totalMatches: totalHits ?? 0,
    fullReport: rest,
    dateOfCheck: createdAt,
    matches:
      hits?.map(
        ({ matchedName, dateOfBirth, countries, matchTypes, aka, listingsRelatedToMatch }) => {
          const { sanctions, warnings, pep, adverseMedia } = listingsRelatedToMatch ?? {};

          return {
            matchedName,
            dateOfBirth,
            countries: countries?.join(', ') ?? '',
            matchTypes: matchTypes?.join(', ') ?? '',
            aka: aka?.join(', ') ?? '',
            sanctions:
              sanctions?.map(sanction => ({
                sanction: sanction?.sourceName,
                date: sanction?.date,
                source: sanction?.sourceUrl,
              })) ?? [],
            warnings:
              warnings?.map(warning => ({
                warning: warning?.sourceName,
                date: warning?.date,
                source: warning?.sourceUrl,
              })) ?? [],
            pep:
              pep?.map(pepItem => ({
                person: pepItem?.sourceName,
                date: pepItem?.date,
                source: pepItem?.sourceUrl,
              })) ?? [],
            adverseMedia:
              adverseMedia?.map(adverseMediaItem => ({
                entry: adverseMediaItem?.sourceName,
                date: adverseMediaItem?.date,
                source: adverseMediaItem?.sourceUrl,
              })) ?? [],
          };
        },
      ) ?? [],
  };
};
