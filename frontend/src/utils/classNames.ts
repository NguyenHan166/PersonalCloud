/**
 * Utility function to merge class names
 * Filters out falsy values and joins classes
 */
export function classNames(...classes: unknown[]): string {
  return classes.filter((c): c is string => typeof c === 'string' && c !== '').join(' ');
}


