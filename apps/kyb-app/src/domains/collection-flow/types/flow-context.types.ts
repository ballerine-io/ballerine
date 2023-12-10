export interface FlowConfig {
  apiUrl: string;
  tokenId: string;
  appState: string;
  customerCompany: string;
  stepsProgress?: Record<string, { isCompleted: boolean }>;
}

export type CollectionFlowContext = Record<string, unknown> & {
  flowConfig?: FlowConfig;
};
