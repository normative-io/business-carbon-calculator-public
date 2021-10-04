/** Determines if a value is non-nullable (and ensures type-safety within rxjs filters). */
export function isNonNullable<T>(value?: T | null): value is NonNullable<T> {
  return typeof value !== 'undefined' && value !== null;
}
