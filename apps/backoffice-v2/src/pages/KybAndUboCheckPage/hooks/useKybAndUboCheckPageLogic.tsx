import {
  AlertTriangle,
  AlertTriangleIcon,
  Briefcase,
  Building2,
  BuildingIcon,
  Calendar,
  Check,
  ExternalLink,
  FileText,
  Globe,
  ListChecksIcon,
  LucideIcon,
  MapPin,
  MapPinIcon,
  ShieldCheck,
  UsersRoundIcon,
  X,
} from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/common/components/atoms/Button/Button';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { CardHeader } from '@/common/components/atoms/Card/Card.Header';
import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { ctw } from '@/common/utils/ctw/ctw';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { ParsedBooleanSchema } from '@ballerine/ui';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { z } from 'zod';

type CheckPageSection = {
  id: string;
  title: string;
  Component: JSX.Element;

  description?: string;
  Icon?: LucideIcon;
  label?: string;
  hasViolations?: boolean;
};

export const useKybAndUboCheckPageLogic = () => {
  const locale = useLocale();
  const { checkId } = useParams<{ checkId: string }>();
  const { data: customer } = useCustomerQuery();

  const { data: check, isLoading: isLoadingCheck } = {
    data: {
      id: 'checkId',
      type: 'check',
      status: 'cleared',
      companyName: 'Company Name',
      companyNumber: '123456789',
      riskLevel: 'low',
      countryCode: 'US',
      checkType: 'kyb',
      checkResult: {
        status: 'passed',
        violations: [],
        riskLevel: 'low',
      },
      businessId: '123456789',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    isLoading: false,
  };

  // const { id } = check ?? {};

  const sections = useMemo(() => {
    const findings = [
      { title: 'Registry Information Detected', status: 'success' },
      { title: 'Active Company', status: 'success' },
      { title: 'Incorporated > 1 year ago', status: 'success' },
      { title: 'abcd', status: 'warning' },
      { title: 'Sanctions Detected', status: 'risk' },
      { title: 'Company Structure Extracted', status: 'success' },
      { title: 'Registered Address Verified', status: 'success' },
      { title: 'Not a High Risk Jurisdiction', status: 'success' },
    ];

    // Data for the business details
    const businessDetails = [
      {
        icon: <Building2 size={20} />,
        label: 'Registered Business Name',
        value: 'Acmeshop LTD',
      },
      {
        icon: <FileText size={20} />,
        label: 'Registration Number',
        value: '12412352351',
      },
      {
        icon: <ShieldCheck size={20} />,
        label: 'Status',
        value: 'Active',
        valueClassName: 'text-green-500', // Optional class for specific values
      },
      {
        icon: <MapPin size={20} />,
        label: 'Registered Address',
        value:
          '145 Samish Way, Bellingham, WA, United States, Washington qwejiwqejoiewqjoiewijoqjeiowqiojewqejoiqw',
      },
      {
        icon: <Globe size={20} />,
        label: 'Country',
        value: (
          <div className="flex items-center">
            <span className="mr-2">🇺🇸</span> United States
          </div>
        ),
      },
      {
        icon: <Briefcase size={20} />,
        label: 'Company Type',
        value: 'Limited Company',
      },
      {
        icon: <Calendar size={20} />,
        label: 'Incorporation Date',
        value: '14/02/2023',
      },
    ];

    // Data definitions
    const leftColumnData: Array<{ label: string; value: React.ReactNode | string }> = [
      { label: 'Registered Business Name', value: 'Company LLC' },
      { label: 'Company Registration Number', value: '202400701R' },
      {
        label: 'Country',
        value: (
          <div className="flex items-center gap-2">
            {/* Assuming Flag component is available in scope, using placeholder */}
            {/* Replace with actual Flag component if available */}
            <span title="Flag Placeholder" className="inline-block h-4 w-4 text-red-600">
              🚩
            </span>
            <p className="text-gray-600">United Kingdom</p>
          </div>
        ),
      },
      { label: 'Incorporation Date', value: '14/02/2023' },
      { label: 'Registration Authority', value: 'Companies House, United Kingdom' },
      { label: 'Industry', value: 'Dormant Company' },
      { label: 'Legal Representative Name', value: 'John Smith' },
      { label: 'Employees Number', value: '1,483' },
    ];

    const rightColumnData: Array<{ label: string; value: React.ReactNode | string }> = [
      { label: 'Status', value: <p className="text-green-500">Active</p> },
      { label: 'Company Type', value: 'Limited' },
      { label: 'Registered Address', value: '151 West 34th Street, New York, NY 10001' },
      { label: 'Expiry Date', value: '14/02/2031' },
      {
        label: 'History Names',
        value: <button className="text-blue-500 hover:underline">View Information &lt;&gt;</button>,
      },
      { label: 'Email Address', value: 'example@email.com' },
      { label: 'Phone Number', value: '+972 548000000' },
      { label: 'Last Updated', value: '14/02/2024' },
    ];

    // Helper function to render each item
    const renderItem = (item: { label: string; value: React.ReactNode | string }) => (
      <div key={item.label}>
        <h2 className="mb-1 text-sm font-medium text-gray-900">{item.label}</h2>
        {typeof item.value === 'string' ? (
          <p className="text-gray-600">{item.value}</p>
        ) : (
          item.value // Render JSX directly if it's not a string
        )}
      </div>
    );

    const complianceData = {
      totalMatches: 1,
      fullReportLink: '#', // Replace with actual link
      match: {
        primaryName: 'Hong Pang Gems & Jewellery (HK) Co. Limited',
        lastReviewed: '16/05/2022',
        labels: ['Special Interest Entity (SIE)', 'Sanctions Lists'],
        reasonsForMatch: ['Full Primary Name'],
        sources: [
          { url: '#', text: 'http://www.treas.gov/press/releases/reports/linkdata%20%20doc...' }, // Replace with actual link
          { url: '#', text: 'http://www.treasury.gov/offices/enforcement/ofac/actions/200...' }, // Replace with actual link
        ],
        alternativeNamesLink: '#', // Replace with actual link
        officialLists: ['Office of Foreign Assets Control (OFAC)'],
        furtherInformation: 'Currently listed as a sanctioned business by OFAC',
        linkedIndividuals: [
          {
            name: 'Kong Po',
            description: 'Kong Po is associated to Hong Pang Gems & Jewellery (HK) Co. Limited',
          },
        ],
        linkedAddresses: [
          {
            country: 'Hong Kong',
            city: 'Wan Chai',
            address: "Room 3605 36/F Wu Chung House, 213 Queen's Road East",
          },
          {
            country: 'Myanmar',
            city: 'Mandalay',
            address: '11, Huang Ching (Gold) Road, Between 64/65 Street Myo Thit',
          },
          {
            country: 'Hong Kong',
            city: 'Kowloon',
            address: '12th Floor C, Jade Exchange Center 513-531, Canton Road',
          },
          {
            country: 'China',
            city: 'Beijing',
            address:
              '6A, 6D North Section, 7th Building, Chilung Park 68 Sin Chung St East City Drive',
          },
          { country: 'China', city: 'Kunming', address: 'No. 19, Hung Hua Bridge Yunnan' },
          {
            country: 'China',
            city: 'Sham Cheng',
            address:
              '28th and 29th Floor, Overseas Friendship Building 2, Yun Chun Road Lo Hu Kuang Tung',
          },
        ],
      },
    };

    return [
      {
        id: 'profile',
        title: 'Profile',
        Icon: BuildingIcon,
        Component: (
          <Card>
            <CardHeader className="block">
              <h3 className="mb-2 text-base font-medium text-gray-700">Overall Risk Level</h3>
              <div className="inline-block rounded-md bg-red-100 px-3 py-1 font-medium text-red-700">
                Critical Risk
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4">
                {businessDetails.map((item, index) => (
                  <div className="flex items-center" key={index}>
                    <div className="w-8 text-gray-400">{item.icon}</div>
                    <div className="w-64 font-medium text-gray-700">{item.label}</div>
                    <div
                      className={`!max-w-[32rem] flex-1 truncate 2xl:!max-w-none ${
                        item.valueClassName || ''
                      }`}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ),
      },
      {
        id: 'checks',
        title: 'Checks',
        Icon: ListChecksIcon,
        Component: (
          <Card>
            <CardContent className="grid grid-cols-3 gap-4 py-6">
              {findings.map(item => (
                <Card
                  key={item.title}
                  className={ctw('flex basis-1/3 items-center space-x-2 bg-gray-100', {
                    'bg-green-100': item.status === 'success',
                    'bg-orange-100': item.status === 'warning',
                    'bg-red-100': item.status === 'risk',
                  })}
                >
                  <CardContent className="flex min-h-14 items-center space-x-2 py-2 text-sm">
                    {item.status === 'success' ? (
                      <div className="rounded-full bg-green-500 p-0.5 d-4">
                        <Check className="text-white d-3" />
                      </div>
                    ) : (
                      <div className="rounded-full bg-red-500 p-0.5 d-4">
                        <X className="text-white d-3" />
                      </div>
                    )}

                    <span>{item.title}</span>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        ),
      },
      {
        id: 'company-sanctions',
        title: 'Company Sanctions',
        Icon: AlertTriangleIcon,
        Component: (
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h1 className="mb-6 text-2xl font-bold">Compliance check results</h1>

            <div className="mb-8 grid grid-cols-2 gap-4">
              <div>
                <h2 className="mb-2 text-base font-medium text-gray-600">Total matches</h2>
                <div className="inline-block rounded-md bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                  {complianceData.totalMatches} match{complianceData.totalMatches !== 1 ? 'es' : ''}
                </div>
              </div>

              <div>
                <h2 className="mb-2 text-base font-medium text-gray-600">Full report</h2>
                <Link
                  to={complianceData.fullReportLink}
                  className="inline-flex items-center text-sm text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View report
                  <ExternalLink className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>

            <h2 className="mb-5 text-xl font-semibold">Match 1</h2>

            <div className="mb-6 grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
              <div>
                <h3 className="mb-1 text-sm font-medium text-gray-500">Primary Name</h3>
                <p className="text-base">{complianceData.match.primaryName}</p>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-medium text-gray-500">Last reviewed</h3>
                <p className="text-base">{complianceData.match.lastReviewed}</p>
              </div>
            </div>

            {/* Labels */}
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-gray-500">Labels</h3>
              <div className="space-y-2">
                {complianceData.match.labels.map((label, index) => (
                  <div key={index} className="flex items-center text-base">
                    <AlertTriangle className="mr-2 h-4 w-4 flex-shrink-0 text-amber-500" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-1 text-sm font-medium text-gray-500">Reasons for Match</h3>
              {complianceData.match.reasonsForMatch.map((reason, index) => (
                <p key={index} className="text-base">
                  {reason}
                </p>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium text-gray-500">Sources</h3>
              <div className="space-y-1">
                {complianceData.match.sources.map((source, index) => (
                  <Link
                    key={index}
                    to={source.url}
                    className="block truncate text-sm text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {source.text}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="mb-1 text-sm font-medium text-gray-500">Alternative Names</h3>
              <Link
                to={complianceData.match.alternativeNamesLink}
                className="inline-flex items-center text-sm text-blue-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View names
                <ExternalLink className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {/* Official Lists */}
            <div className="mb-6">
              <h3 className="mb-1 text-sm font-medium text-gray-500">Official Lists</h3>
              {complianceData.match.officialLists.map((list, index) => (
                <p key={index} className="text-base">
                  {list}
                </p>
              ))}
            </div>

            <div className="mb-6">
              <h3 className="mb-1 text-sm font-medium text-gray-500">Further information</h3>
              <p className="text-base">{complianceData.match.furtherInformation}</p>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 text-base font-semibold">Linked Individuals</h3>
              {complianceData.match.linkedIndividuals.length > 0 ? (
                <>
                  <div className="grid grid-cols-3 gap-x-4 pb-1">
                    <h4 className="text-sm font-medium text-gray-500">Name</h4>
                    <h4 className="col-span-2 text-sm font-medium text-gray-500">Description</h4>
                  </div>
                  <div className="space-y-2">
                    {complianceData.match.linkedIndividuals.map((individual, index) => (
                      <div key={index} className="grid grid-cols-3 gap-x-4 border-t pt-2 text-base">
                        <p>{individual.name}</p>
                        <p className="col-span-2 break-words">{individual.description}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">No linked individuals found.</p>
              )}
            </div>

            <div>
              <h3 className="mb-3 text-base font-semibold">Linked Addresses</h3>
              {complianceData.match.linkedAddresses.length > 0 ? (
                <>
                  <div className="grid grid-cols-5 gap-x-4 pb-1">
                    <h4 className="col-span-1 text-sm font-medium text-gray-500">Country</h4>
                    <h4 className="col-span-1 text-sm font-medium text-gray-500">City</h4>
                    <h4 className="col-span-3 text-sm font-medium text-gray-500">Address</h4>
                  </div>
                  <div className="space-y-2">
                    {complianceData.match.linkedAddresses.map((addr, index) => (
                      <div key={index} className="grid grid-cols-5 gap-x-4 border-t pt-2 text-base">
                        <p className="col-span-1 break-words">{addr.country}</p>
                        <p className="col-span-1 break-words">{addr.city}</p>
                        <p className="col-span-3 break-words">{addr.address}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">No linked addresses found.</p>
              )}
            </div>
          </div>
        ),
      },
      {
        id: 'registry-information',
        title: 'Company Registry Information',
        Icon: UsersRoundIcon,
        Component: (
          <Card className="w-full overflow-hidden rounded-md border border-gray-200 p-6">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
              <div className="space-y-6">{leftColumnData.map(renderItem)}</div>

              <div className="space-y-6">{rightColumnData.map(renderItem)}</div>
            </div>
          </Card>
        ),
      },
      {
        id: 'company-structure',
        title: 'Company Structure',
        Icon: ListChecksIcon,
        Component: <div>Company Structure</div>,
      },
      {
        id: 'registered-address',
        title: 'Registered Address',
        Icon: MapPinIcon,
        Component: (
          <Card className="overflow-hidden border shadow-sm">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2">
                <div className="space-y-4 p-2 pt-0">
                  <h2 className="text-2xl font-bold tracking-tight">Headquarters Address</h2>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Country</div>
                      <div>United Kingdom</div>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">State / province / region</div>
                      <div>N/A</div>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">City / town</div>
                      <div>London</div>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Street</div>
                      <div>Oxford</div>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">Number</div>
                      <div>10</div>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-medium">ZIP / Postal code</div>
                      <div>123124</div>
                    </div>
                  </div>
                </div>

                <div className="relative bg-slate-100">
                  <div className="absolute right-2 top-2 z-10">
                    <Button className="rounded-md bg-white shadow-sm hover:bg-gray-50" size="icon">
                      <ExternalLink className="h-5 w-5 text-gray-500" />
                    </Button>
                  </div>

                  <div className="rounded-lg">{/* TODO: Map impl here... */}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ),
      },
    ] as CheckPageSection[];
  }, [check]);

  const navigate = useNavigate();
  const onNavigateBack = () => navigate(-1);

  // TODO
  const notes = [] as any[];
  // useNotesByNoteable({
  //   noteableId: check?.id || '',
  //   noteableType: 'Report',
  // });

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
    isLoadingCheck,
    customer,
    checkId,
    onNavigateBack,
    sections,
    isNotesOpen,
    setIsNotesOpen,
    notes,
  };
};
