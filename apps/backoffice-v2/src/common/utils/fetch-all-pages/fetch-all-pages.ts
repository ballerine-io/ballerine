const DEFAULT_PAGE_SIZE = 50;

/**
 * A generic type for paginated API responses
 */
export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  totalItems?: number;
}

/**
 * A generic type for pagination parameters
 */
export interface PaginationParams {
  page: {
    number: number;
    size: number;
  };
}

/**
 * Fetches all pages from a paginated API endpoint
 *
 * @param fetchFunction - The function to use for fetching a single page
 * @param baseParams - The base parameters to pass to the fetch function (excluding pagination)
 * @param pageSize - The number of items per page (default: 50)
 * @param onProgress - Optional callback for progress updates
 * @returns All data from all pages combined in correct page order
 */
export async function fetchAllPages<T, P extends PaginationParams>(
  fetchFunction: (params: P) => Promise<PaginatedResponse<T> | undefined>,
  baseParams: Omit<P, keyof PaginationParams>,
  pageSize = DEFAULT_PAGE_SIZE,
  onProgress?: (current: number, total: number, items: number) => void,
): Promise<T[]> {
  try {
    // Create params for the first page
    const firstPageParams = {
      ...(baseParams as any),
      page: { number: 1, size: pageSize },
    } as P;

    // Fetch the first page to get total pages
    const firstPageResult = await fetchFunction(firstPageParams);

    if (!firstPageResult) {
      throw new Error('Failed to fetch data');
    }

    const { totalPages, totalItems = 0 } = firstPageResult;

    // Start with the first page data
    let allData = [...firstPageResult.data];

    // If we have more than one page, fetch the rest concurrently
    if (totalPages > 1) {
      onProgress?.(1, totalPages, totalItems);

      // Create an array of promises with their corresponding page numbers
      const pagePromises: Array<{
        pageNum: number;
        promise: Promise<PaginatedResponse<T> | undefined>;
      }> = [];

      for (let pageNum = 2; pageNum <= totalPages; pageNum++) {
        const pageParams = {
          ...(baseParams as any),
          page: { number: pageNum, size: pageSize },
        } as P;

        // Store the page number with its promise
        pagePromises.push({
          pageNum,
          promise: fetchFunction(pageParams),
        });
      }

      // Wait for all promises to complete
      const pageResultsPromises = pagePromises.map(async ({ pageNum, promise }) => {
        const result = await promise;
        return { pageNum, result };
      });

      const pageResults = await Promise.all(pageResultsPromises);

      // Sort results by page number to ensure proper order
      pageResults.sort((a, b) => a.pageNum - b.pageNum);

      // Add each page's data in the correct order
      for (const { pageNum, result } of pageResults) {
        if (result?.data) {
          allData = [...allData, ...result.data];
          onProgress?.(pageNum, totalPages, totalItems);
        }
      }

      // Final progress update
      onProgress?.(totalPages, totalPages, totalItems);
    }

    return allData;
  } catch (error) {
    console.error('Error fetching all pages:', error);
    throw error;
  }
}
