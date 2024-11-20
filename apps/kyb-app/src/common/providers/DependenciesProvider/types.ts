export interface IDependenciesContext {
  refetchAll: () => Promise<void>;
  isLoading: boolean;
  isFetching: boolean;
}
