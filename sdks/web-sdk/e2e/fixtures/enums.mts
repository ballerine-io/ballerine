export const Flow = {
  MY_KYC_FLOW: 'my-kyc-flow',
  MY_KYB_FLOW: 'my-kyb-flow',
};

export type TFlow = (typeof Flow)[keyof typeof Flow];
