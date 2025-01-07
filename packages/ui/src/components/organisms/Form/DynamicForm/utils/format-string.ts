export const formatString = (string: string, metadata: Record<string, string> = {}) => {
  // Replace patterns like {key} with corresponding metadata values
  return string.replace(/\{([^}]+)\}/g, (match, key) => {
    return metadata[key] || match;
  });
};
