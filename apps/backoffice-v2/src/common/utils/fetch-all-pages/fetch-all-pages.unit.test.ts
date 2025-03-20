import { describe, expect, test, vi, beforeEach } from 'vitest';
import { fetchAllPages, type PaginatedResponse, type PaginationParams } from './fetch-all-pages';

// Mock data for testing
interface TestItem {
  id: number;
  name: string;
}

interface TestParams extends PaginationParams {
  filter?: string;
  sort?: string;
}

describe('fetchAllPages', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('should return data from a single page', async () => {
    // Mock data for a single page response
    const mockData: TestItem[] = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];

    // Mock fetch function that returns a single page
    const mockFetch = vi.fn().mockResolvedValue({
      data: mockData,
      totalPages: 1,
      totalItems: mockData.length,
    } as PaginatedResponse<TestItem>);

    // Base parameters for the fetch
    const baseParams = { filter: 'test', sort: 'asc' };

    // Call the function
    const result = await fetchAllPages<TestItem, TestParams>(mockFetch, baseParams, 10);

    // Verify the fetch was called correctly
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith({
      ...baseParams,
      page: { number: 1, size: 10 },
    });

    // Verify the result contains all the data
    expect(result).toEqual(mockData);
  });

  test('should fetch and combine multiple pages in correct order', async () => {
    // Mock data for multiple pages
    const page1Data: TestItem[] = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];

    const page2Data: TestItem[] = [
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' },
    ];

    const page3Data: TestItem[] = [
      { id: 5, name: 'Item 5' },
      { id: 6, name: 'Item 6' },
    ];

    // Mock fetch function that handles multiple pages
    const mockFetch = vi.fn().mockImplementation((params: TestParams) => {
      const pageNumber = params.page.number;

      if (pageNumber === 1) {
        return Promise.resolve({
          data: page1Data,
          totalPages: 3,
          totalItems: 6,
        } as PaginatedResponse<TestItem>);
      } else if (pageNumber === 2) {
        return Promise.resolve({
          data: page2Data,
          totalPages: 3,
          totalItems: 6,
        } as PaginatedResponse<TestItem>);
      } else if (pageNumber === 3) {
        return Promise.resolve({
          data: page3Data,
          totalPages: 3,
          totalItems: 6,
        } as PaginatedResponse<TestItem>);
      }

      return Promise.resolve(undefined);
    });

    // Call the function
    const result = await fetchAllPages<TestItem, TestParams>(mockFetch, { filter: 'test' }, 2);

    // Verify the fetch was called for all pages
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(mockFetch).toHaveBeenCalledWith({
      filter: 'test',
      page: { number: 1, size: 2 },
    });
    expect(mockFetch).toHaveBeenCalledWith({
      filter: 'test',
      page: { number: 2, size: 2 },
    });
    expect(mockFetch).toHaveBeenCalledWith({
      filter: 'test',
      page: { number: 3, size: 2 },
    });

    // Verify the result contains all the data in correct order
    expect(result).toEqual([...page1Data, ...page2Data, ...page3Data]);
  });

  test('should maintain correct page order even if responses arrive out of order', async () => {
    // Mock data for multiple pages
    const page1Data: TestItem[] = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];
    const page2Data: TestItem[] = [
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' },
    ];
    const page3Data: TestItem[] = [
      { id: 5, name: 'Item 5' },
      { id: 6, name: 'Item 6' },
    ];

    // Mock fetch function that returns page 2 before page 3
    const mockFetch = vi.fn().mockImplementation((params: TestParams) => {
      const pageNumber = params.page.number;

      if (pageNumber === 1) {
        return Promise.resolve({
          data: page1Data,
          totalPages: 3,
          totalItems: 6,
        } as PaginatedResponse<TestItem>);
      } else if (pageNumber === 2) {
        // Add a delay to page 2 to ensure it resolves after page 3
        return new Promise(resolve => {
          setTimeout(() => {
            resolve({
              data: page2Data,
              totalPages: 3,
              totalItems: 6,
            } as PaginatedResponse<TestItem>);
          }, 50);
        });
      } else if (pageNumber === 3) {
        return Promise.resolve({
          data: page3Data,
          totalPages: 3,
          totalItems: 6,
        } as PaginatedResponse<TestItem>);
      }

      return Promise.resolve(undefined);
    });

    // Call the function
    const result = await fetchAllPages<TestItem, TestParams>(mockFetch, {}, 2);

    // Verify the fetch was called for all pages
    expect(mockFetch).toHaveBeenCalledTimes(3);

    // Verify the result contains all the data in correct order
    // (even though page 3 response comes back before page 2)
    expect(result).toEqual([...page1Data, ...page2Data, ...page3Data]);
  });

  test('should call onProgress with the correct progress information', async () => {
    // Mock data
    const mockData = Array.from({ length: 3 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
    }));

    // Mock fetch function
    const mockFetch = vi.fn().mockResolvedValue({
      data: mockData,
      totalPages: 3,
      totalItems: 9,
    } as PaginatedResponse<TestItem>);

    // Mock progress callback
    const mockProgress = vi.fn();

    // Call the function
    await fetchAllPages<TestItem, TestParams>(mockFetch, {}, 3, mockProgress);

    // Verify progress was called for each page
    expect(mockProgress).toHaveBeenCalledTimes(4); // Initial + 3 pages
    expect(mockProgress).toHaveBeenNthCalledWith(1, 1, 3, 9); // First page
    expect(mockProgress).toHaveBeenLastCalledWith(3, 3, 9); // Final page
  });

  test('should throw an error when the fetch function fails', async () => {
    // Mock fetch function that throws an error
    const mockFetch = vi.fn().mockRejectedValue(new Error('API Error'));

    // Attempt to call the function and expect it to throw
    await expect(fetchAllPages<TestItem, TestParams>(mockFetch, {}, 10)).rejects.toThrow(
      'API Error',
    );

    // Verify the fetch was called
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  test('should throw an error when the first page fetch returns undefined', async () => {
    // Mock fetch function that returns undefined
    const mockFetch = vi.fn().mockResolvedValue(undefined);

    // Attempt to call the function and expect it to throw
    await expect(fetchAllPages<TestItem, TestParams>(mockFetch, {}, 10)).rejects.toThrow(
      'Failed to fetch data',
    );

    // Verify the fetch was called
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  test('should handle missing page data in subsequent pages', async () => {
    // Mock data for pages
    const page1Data: TestItem[] = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];

    // Mock fetch function that returns undefined for page 2
    const mockFetch = vi
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: page1Data,
          totalPages: 2,
          totalItems: 4,
        } as PaginatedResponse<TestItem>),
      )
      .mockImplementationOnce(() => Promise.resolve(undefined));

    // Call the function
    const result = await fetchAllPages<TestItem, TestParams>(mockFetch, {}, 2);

    // Verify the fetch was called twice
    expect(mockFetch).toHaveBeenCalledTimes(2);

    // Verify we only got page 1 data since page 2 returned undefined
    expect(result).toEqual(page1Data);
  });

  test('should handle missing data property in subsequent pages', async () => {
    // Mock data for pages
    const page1Data: TestItem[] = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
    ];

    // Mock fetch function that returns a response without data for page 2
    const mockFetch = vi
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          data: page1Data,
          totalPages: 2,
          totalItems: 4,
        } as PaginatedResponse<TestItem>),
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          totalPages: 2,
          totalItems: 4,
          // Missing data property
        } as any),
      );

    // Call the function
    const result = await fetchAllPages<TestItem, TestParams>(mockFetch, {}, 2);

    // Verify the fetch was called twice
    expect(mockFetch).toHaveBeenCalledTimes(2);

    // Verify we only got page 1 data since page 2 had no data property
    expect(result).toEqual(page1Data);
  });

  test('should use default page size when not provided', async () => {
    // Mock data
    const mockData: TestItem[] = [{ id: 1, name: 'Item 1' }];

    // Mock fetch function
    const mockFetch = vi.fn().mockResolvedValue({
      data: mockData,
      totalPages: 1,
      totalItems: 1,
    } as PaginatedResponse<TestItem>);

    // Call the function without specifying pageSize
    await fetchAllPages<TestItem, TestParams>(mockFetch, {});

    // Verify the fetch was called with the default page size
    expect(mockFetch).toHaveBeenCalledWith({
      page: { number: 1, size: 50 }, // Default is 50
    });
  });
});
