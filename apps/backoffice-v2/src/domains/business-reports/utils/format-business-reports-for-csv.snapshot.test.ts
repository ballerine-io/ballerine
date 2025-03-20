import { describe, test, expect, vi, beforeEach } from 'vitest';
import { formatBusinessReportsForCsv } from './format-business-reports-for-csv';

// Import fixtures
import minimalReport from './__fixtures__/minimal-report.json';
import violationsReport from './__fixtures__/violations-report.json';
import trafficReport from './__fixtures__/traffic-report.json';
import socialMediaReport from './__fixtures__/social-media-report.json';
import ecosystemReport from './__fixtures__/ecosystem-report.json';
import mccReport from './__fixtures__/mcc-report.json';
import statusNotesReport from './__fixtures__/status-notes-report.json';
import sandboxReport from './__fixtures__/sandbox-report.json';
import exampleReport from './__fixtures__/example-report.json';
import { TBusinessReport } from '../fetchers';
import { convertToCSV } from '@/common/utils/export-to-csv/export-to-csv';

// Mock dayjs for consistent date output
vi.mock('dayjs', () => {
  const mockDayjs = vi.fn(() => ({
    utc: vi.fn().mockReturnThis(),
    local: vi.fn().mockReturnThis(),
    toDate: vi.fn().mockImplementation(() => new Date('2023-01-01T12:00:00Z')),
    format: vi.fn().mockReturnValue('2023-01-01T12:00:00Z'),
  }));

  // Add utc as a property to the function - need to use type assertion to avoid linter error
  (mockDayjs as any).utc = (date: any) => mockDayjs(date);

  return {
    default: mockDayjs,
  };
});

// Test fixtures mapping
const fixtureMapping = [
  { fixture: minimalReport, name: 'minimal-report' },
  { fixture: violationsReport, name: 'violations-report' },
  { fixture: trafficReport, name: 'traffic-report' },
  { fixture: socialMediaReport, name: 'social-media-report' },
  { fixture: ecosystemReport, name: 'ecosystem-report' },
  { fixture: mccReport, name: 'mcc-report' },
  { fixture: statusNotesReport, name: 'status-notes-report' },
  { fixture: sandboxReport, name: 'sandbox-report' },
  { fixture: exampleReport, name: 'example-report' },
];

// Helper function to handle date objects in serialization
const serializeWithDates = (data: any): any => {
  return JSON.parse(
    JSON.stringify(data, (key, value) => {
      if (value instanceof Date) {
        // For testing, replace with a consistent date string
        return value.toISOString();
      }

      return value;
    }),
  );
};

describe('formatBusinessReportsForCsv Snapshot Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should handle empty array input', () => {
    const result = formatBusinessReportsForCsv([]);
    expect(result).toEqual([]);
  });

  // Dynamic test for each fixture
  fixtureMapping.forEach(({ fixture, name }) => {
    test(`should format ${name} correctly`, () => {
      // Format the input data
      const result = formatBusinessReportsForCsv(fixture as unknown as TBusinessReport[]);

      // Serialize dates for comparison
      const serializedResult = serializeWithDates(result);

      // Use Vitest's built-in snapshot matching
      expect(serializedResult).toMatchSnapshot();
    });
  });

  test('should format multiple reports correctly', () => {
    // Test with multiple different reports
    const fixtures = [minimalReport[0], violationsReport[0], trafficReport[0]] as any[];

    const result = formatBusinessReportsForCsv(fixtures);

    // Verify we get the right number of formatted reports
    expect(result).toHaveLength(fixtures.length);

    // Verify report properties without using direct array indexing for safety
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ 'Merchant Name': minimalReport[0]?.companyName }),
        expect.objectContaining({ 'Merchant Name': violationsReport[0]?.companyName }),
        expect.objectContaining({ 'Merchant Name': trafficReport[0]?.companyName }),
      ]),
    );
  });
});

describe('formatBusinessReports as CSV Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test('should format sandbox report correctly', () => {
    const formattedData = formatBusinessReportsForCsv(
      sandboxReport as unknown as TBusinessReport[],
    );
    const result = convertToCSV(formattedData as unknown as Array<Record<string, unknown>>);
    expect(result).toMatchSnapshot();
  });
});
