import { BlocksComponent } from '@ballerine/blocks';
import { ParsedBooleanSchema } from '@ballerine/ui';
import { AlertTriangleIcon, ListChecksIcon, LucideIcon, UsersRoundIcon } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useCompanySanctionsBlock } from '@/lib/blocks/hooks/useCompanySanctionsBlock/useCompanySanctionsBlock';
import { useKybRegistryInfoBlock } from '@/lib/blocks/hooks/useKybRegistryInfoBlock/useKybRegistryInfoBlock';
import { useUbosRegistryProvidedBlock } from '@/lib/blocks/hooks/useUbosRegistryProvidedBlock/useUbosRegistryProvidedBlock';
import { useKybAndUbosChecksQuery } from '@/domains/checks/hooks/queries/useKybAndUbosChecksQuery/useKybAndUbosChecksQuery';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';

type CheckPageSection = {
  id: string;
  title: string;
  Component: JSX.Element;

  description?: string;
  Icon?: LucideIcon;
  label?: string;
  hasViolations?: boolean;
  condition?: () => boolean;
};

export const useKybAndUboCheckPageLogic = () => {
  const { checkId } = useParams<{ checkId: string }>();
  const { data: customer } = useCustomerQuery();

  // TODO: replace with fetch by id endpoint
  const { data: allChecks, isLoading: isLoadingChecks } = useKybAndUbosChecksQuery({
    page: { number: 1, size: 10 },
  });
  const check = useMemo(() => {
    if (!allChecks) return null;
    return allChecks.data.find(check => check.id === checkId);
  }, [allChecks, checkId]);

  const navigate = useNavigate();
  const onNavigateBack = () => navigate(-1);

  // TODO
  const notes = [] as any[];
  // useNotesByNoteable({
  //   noteableId: check?.id || '',
  //   noteableType: 'Report',
  // });

  const companySanctions = check?.sanctions?.output?.data?.map(sanction => ({
    sources: sanction?.entity?.sources,
    officialLists: sanction?.entity?.officialLists,
    fullReport: sanction,
    linkedIndividuals: sanction?.entity?.linkedIndividuals,
    lastReviewed: sanction?.entity?.lastReviewed,
    primaryName: sanction?.entity?.name,
    labels: sanction?.entity?.categories,
    reasonsForMatch: sanction?.matchedFields,
    furtherInformation: sanction?.entity?.furtherInformation,
    alternativeNames: sanction?.entity?.otherNames,
    places: sanction?.entity?.places,
  }));
  const companySanctionsBlock = useCompanySanctionsBlock(companySanctions);

  const registryInfoBlock = useKybRegistryInfoBlock({
    pluginsOutput: { businessInformation: { data: [check?.registryInformation?.output?.data] } },
    workflow: {},
  });

  const companyStructureBlock = useUbosRegistryProvidedBlock(
    check?.companyStructure?.output ?? { nodes: [], edges: [] },
  );

  const sections = useMemo(() => {
    return [
      {
        id: 'company-sanctions',
        title: 'Company Sanctions',
        Icon: AlertTriangleIcon,
        Component: (
          <>
            {!!check?.sanctions ? (
              <BlocksComponent blocks={[...companySanctionsBlock]} cells={cells}>
                {(Cell, cell) => <Cell {...cell} />}
              </BlocksComponent>
            ) : (
              <Card>
                <CardContent className="p-6">Data not Available</CardContent>
              </Card>
            )}
          </>
        ),
      },
      {
        id: 'registry-information',
        title: 'Company Registry Information',
        Icon: UsersRoundIcon,
        Component: (
          <>
            {!!check?.registryInformation?.output?.data ? (
              <BlocksComponent blocks={[...registryInfoBlock]} cells={cells}>
                {(Cell, cell) => <Cell {...cell} />}
              </BlocksComponent>
            ) : (
              <Card>
                <CardContent className="p-6">Data not Available</CardContent>
              </Card>
            )}
          </>
        ),
      },
      {
        id: 'company-structure',
        title: 'Company Structure',
        Icon: ListChecksIcon,
        Component: (
          <>
            {!!check?.companyStructure?.output ? (
              <BlocksComponent blocks={[...companyStructureBlock]} cells={cells}>
                {(Cell, cell) => <Cell {...cell} />}
              </BlocksComponent>
            ) : (
              <Card>
                <CardContent className="p-6">Data not Available</CardContent>
              </Card>
            )}
          </>
        ),
      },
    ] satisfies CheckPageSection[];
  }, [check]);

  const [{ isNotesOpen }, setSearchParams] = useZodSearchParams(
    z.object({ isNotesOpen: ParsedBooleanSchema.catch(false) }),
    { replace: true },
  );

  const setIsNotesOpen = useCallback(
    (value: boolean) => setSearchParams({ isNotesOpen: value }),
    [setSearchParams],
  );

  return {
    check,
    isLoadingCheck: isLoadingChecks,
    customer,
    checkId,
    onNavigateBack,
    sections,
    isNotesOpen,
    setIsNotesOpen,
    notes,
  };
};
