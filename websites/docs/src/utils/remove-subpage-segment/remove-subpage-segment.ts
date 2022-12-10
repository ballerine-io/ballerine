/** Remove the subpage segment of a URL string */
export const removeSubpageSegment = (path: string) => {
  // Include new pages with subpages as part of this if statement.
  if (/(?:install|deploy|integrations-guide|tutorial)\//.test(path)) {
    return path.slice(0, path.lastIndexOf(`/`));
  }

  return path;
};
