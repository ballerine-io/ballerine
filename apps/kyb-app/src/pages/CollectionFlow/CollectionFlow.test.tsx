import { UISchema } from '@/domains/collection-flow';
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
    } as ReturnType<typeof useLanguageParam>);
    vi.mocked(useUISchemasQuery).mockReturnValue({
      data: undefined as unknown as UISchema | null,
      isLoading: false,
    } as ReturnType<typeof useUISchemasQuery>);
    vi.mocked(getCollectionFlowVersion).mockReturnValue(() => <div>Mock Flow Component</div>);
  });

  it('renders loading screen when schema is loading', () => {
    vi.mocked(useUISchemasQuery).mockReturnValue({
      data: undefined as unknown as UISchema | null,
      isLoading: true,
    } as ReturnType<typeof useUISchemasQuery>);

    render(<CollectionFlow />);

    expect(screen.getByText('Loading Screen')).toBeInTheDocument();
  });

  it('renders error message when no version is found', () => {
    vi.mocked(useUISchemasQuery).mockReturnValue({
      data: { version: 999 } as UISchema,
      isLoading: false,
    } as ReturnType<typeof useUISchemasQuery>);
    vi.mocked(getCollectionFlowVersion).mockReturnValue(undefined);

    render(<CollectionFlow />);

    expect(
      screen.getByText(/No version found for UI Definition version: 999/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Please contact the support./i)).toBeInTheDocument();
  });

  it('renders collection flow component when version is found', () => {
    vi.mocked(useUISchemasQuery).mockReturnValue({
      data: { version: 2 } as UISchema,
      isLoading: false,
    } as ReturnType<typeof useUISchemasQuery>);

    render(<CollectionFlow />);

    expect(screen.getByText('Mock Flow Component')).toBeInTheDocument();
  });

  it('calls getCollectionFlowVersion with correct version', () => {
    vi.mocked(useUISchemasQuery).mockReturnValue({
      data: { version: 2 } as UISchema,
      isLoading: false,
    } as ReturnType<typeof useUISchemasQuery>);

    render(<CollectionFlow />);

    expect(getCollectionFlowVersion).toHaveBeenCalledWith(2);
  });
});
