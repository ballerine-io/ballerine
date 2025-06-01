import { useLanguageParam } from '@/hooks/useLanguageParam/useLanguageParam';
import { useUISchemasQuery } from '@/hooks/useUISchemasQuery';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CollectionFlow } from './CollectionFlow';
import { getCollectionFlowVersion } from './versions-repository';

vi.mock('@/hooks/useLanguageParam/useLanguageParam', () => ({
  useLanguageParam: vi.fn(),
}));

vi.mock('@/hooks/useUISchemasQuery', () => ({
  useUISchemasQuery: vi.fn(),
}));

vi.mock('./versions-repository', () => ({
  getCollectionFlowVersion: vi.fn(),
}));

vi.mock('@/common/components/molecules/LoadingScreen', () => ({
  LoadingScreen: () => <div>Loading Screen</div>,
}));

describe('CollectionFlow', () => {
  beforeEach(() => {
    vi.mocked(useLanguageParam).mockReturnValue({
      language: 'en',
      setLanguage: vi.fn(),
    } satisfies ReturnType<typeof useLanguageParam>);
    vi.mocked(useUISchemasQuery).mockReturnValue({
      // @ts-expect-error
      data: undefined,
      isLoading: false,
      error: null,
    } satisfies ReturnType<typeof useUISchemasQuery>);
    vi.mocked(getCollectionFlowVersion).mockReturnValue(() => <div>Mock Flow Component</div>);
  });

  it('renders loading screen when schema is loading', () => {
    // Arrange
    const mockUISchemasQueryResult = {
      // @ts-expect-error
      data: undefined,
      isLoading: true,
      error: null,
    } satisfies ReturnType<typeof useUISchemasQuery>;

    vi.mocked(useUISchemasQuery).mockReturnValue(
      // @ts-expect-error
      mockUISchemasQueryResult,
    );

    // Act
    render(<CollectionFlow />);

    // Assert
    expect(screen.getByText('Loading Screen')).toBeInTheDocument();
  });

  it('renders error message when no version is found', () => {
    // Arrange
    const mockUISchemasQueryResult = {
      // @ts-expect-error
      data: { version: 999 },
      isLoading: false,
      error: null,
    } satisfies ReturnType<typeof useUISchemasQuery>;
    const mockGetCollectionFlowVersion = undefined;

    vi.mocked(useUISchemasQuery).mockReturnValue(
      // @ts-expect-error
      mockUISchemasQueryResult,
    );
    vi.mocked(getCollectionFlowVersion).mockReturnValue(mockGetCollectionFlowVersion);

    // Act
    render(<CollectionFlow />);

    // Assert
    expect(
      screen.getByText(/No version found for UI Definition version: 999/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Please contact the support./i)).toBeInTheDocument();
  });

  it('renders collection flow component when version is found', () => {
    // Arrange
    const mockUISchemasQueryResult = {
      // @ts-expect-error
      data: { version: 2 },
      isLoading: false,
      error: null,
    } satisfies ReturnType<typeof useUISchemasQuery>;

    vi.mocked(useUISchemasQuery).mockReturnValue(
      // @ts-expect-error
      mockUISchemasQueryResult,
    );

    // Act
    render(<CollectionFlow />);

    // Assert
    expect(screen.getByText('Mock Flow Component')).toBeInTheDocument();
  });

  it('calls getCollectionFlowVersion with correct version', () => {
    // Arrange
    const mockUISchemasQueryResult = {
      // @ts-expect-error
      data: { version: 2 },
      isLoading: false,
      error: null,
    } satisfies ReturnType<typeof useUISchemasQuery>;

    vi.mocked(useUISchemasQuery).mockReturnValue(
      // @ts-expect-error
      mockUISchemasQueryResult,
    );

    // Act
    render(<CollectionFlow />);

    // Assert
    expect(getCollectionFlowVersion).toHaveBeenCalledWith(2);
  });
});
