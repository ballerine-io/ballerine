export const getCaseManagementEntitiesHrefByFilterId = ({
  locale,
  filterId,
}: {
  locale: string;
  filterId: string;
}) => {
  const searchParams = new URLSearchParams({
    filterId,
  });

  return `/${locale}/case-management/entities?${searchParams.toString()}`;
};
