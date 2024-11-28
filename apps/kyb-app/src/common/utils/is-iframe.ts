/**
 * Determines if the current window is running within an iframe.
 * Handles both same-origin and cross-origin iframe scenarios.
 *
 * @returns {boolean} True if running in an iframe (including cross-origin), false otherwise
 */
export const isIframe = (): boolean => {
  try {
    // Check if window.self and window.top are the same reference
    const isFramed = window.self !== window.top;

    // Additional security check - try to access parent
    // This will throw an error if cross-origin
    if (isFramed) {
      window.parent.location.origin;
    }

    return isFramed;
  } catch (e: unknown) {
    // If we get a security error, we're definitely in a cross-origin iframe
    return true;
  }
};
