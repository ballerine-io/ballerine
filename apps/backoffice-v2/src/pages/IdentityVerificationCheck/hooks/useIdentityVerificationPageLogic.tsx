import {
  AlertTriangleIcon,
  Briefcase,
  Building2,
  BuildingIcon,
  Calendar,
  FileText,
  Globe,
  LucideIcon,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { ParsedBooleanSchema } from '@ballerine/ui';
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

export const useIdentityVerificationPageLogic = () => {
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
        id: 'identity-verification',
        title: 'Identity Verification',
        Icon: BuildingIcon,
        Component: <div>Identity Verification</div>,
      },
      {
        id: 'sanctions-screening',
        title: 'Sanctions Screening',
        Icon: AlertTriangleIcon,
        Component: <div>Sanctions Screening</div>,
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
