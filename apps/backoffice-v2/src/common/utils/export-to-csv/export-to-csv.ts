import dayjs from 'dayjs';

/**
 * Formats a value for CSV export
 * - Handles Date objects by converting to ISO format in local timezone
 * - Handles arrays by joining with semicolons
 * - Handles objects by converting to JSON strings
 * - Handles primitive values directly
 *
 * @param value - The value to format
 * @returns Formatted string value
 */
const formatValueForCsv = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }

  // Handle Date objects - convert to ISO format in local timezone
  if (value instanceof Date) {
    return dayjs(value).format('YYYY-MM-DDTHH:mm:ssZ');
  }

  // Handle arrays - join with semicolons
  if (Array.isArray(value)) {
    return value.map(item => formatValueForCsv(item)).join(',\n');
  }

  // Handle objects - convert to JSON
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, val]) => `${key}: ${formatValueForCsv(val)}`)
      .join(',\n');
  }

  // Handle primitive values
  return String(value).replace(/"/g, '""');
};

/**
 * Converts an array of objects to a CSV string
 * @param data Array of objects to convert to CSV
 * @returns CSV string
 */
export const convertToCSV = (data: Array<Record<string, unknown>>) => {
  if (!data || data.length === 0) {
    return '';
  }

  // Extract column headers from the first item
  const headers = Object.keys(data[0] || {});
  const csvRows = [headers.join(',')];

  for (const item of data) {
    const values = headers.map(header => {
      const value = item[header];
      const formattedValue = formatValueForCsv(value);

      // Wrap in quotes if contains commas, quotes, or newlines
      return formattedValue.includes(',') ||
        formattedValue.includes('"') ||
        formattedValue.includes('\n')
        ? `"${formattedValue}"`
        : formattedValue;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};

/**
 * Exports data to a CSV file and triggers a download
 * @param data Array of objects to export
 * @param filename Name of the file to download (without extension)
 */
export const exportToCSV = (data: Array<Record<string, unknown>>, filename: string): boolean => {
  if (!data || data.length === 0) {
    return false;
  }

  // Generate CSV and trigger download
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  const fullFilename = `${filename}.csv`;
  link.setAttribute('download', fullFilename);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);

  return true;
};
