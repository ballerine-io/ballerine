import { __ROOT__ } from '../constants';

export const isPathMatch = ({
  pattern,
  path,
  root,
}: {
  pattern: string;
  path: string;
  root: string;
}) => {
  const patternParts = pattern.split('.');

  // Exact matches, no wildcards.
  if (!pattern.includes('*') && patternParts.length > 1) {
    return pattern === path;
  }

  /**
   * @example pattern: 'id', path: 'entity.id' where root is 'entity'
   *  */
  if (patternParts.length === 1 && path === `${root}.${pattern}`) {
    return true;
  }

  // Match any path not at the root level.
  if (pattern.startsWith('*.')) {
    const parts = path.split('.');
    const suffix = pattern.slice(2);

    // parts.length > 2 ensures we have at least one level between root and the target field
    return (parts.length > 2 || root === __ROOT__) && path.endsWith(suffix);
  }

  const regexPattern =
    pattern
      // Escape dots for the regex
      .replace(/\./g, '\\.')
      // Replace * with regex pattern that matches any characters except dots
      .replace(/\*/g, '[^.]+') +
    // Make the pattern match both exact and partial paths
    '(?:\\.[^.]+)*';

  const regex = new RegExp(`^${regexPattern}$`);

  return regex.test(path);
};
