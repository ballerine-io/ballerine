// FIXME: IDE recognizes the type of window.posthog and still errors that the type does not exist on window
const posthog = window.posthog;

export const flowStart = () => {
  posthog && posthog.capture && posthog.capture('flow-start');
};

export const visitedPage = (pathname: string, search: string) => {
  posthog && posthog.capture && posthog.capture('visited-page', { pathname, search });
};

export const flowApproved = () => {
  posthog && posthog.capture && posthog.capture('flow-approved');
};

export const flowDeclined = () => {
  posthog && posthog.capture && posthog.capture('flow-declined');
};

export const flowResubmission = () => {
  posthog && posthog.capture && posthog.capture('flow-resubmission');
};

export const flowUploadLoader = () => {
  posthog && posthog.capture && posthog.capture('flow-upload-loader');
};

export const flowError = () => {
  posthog && posthog.capture && posthog.capture('flow-error');
};
