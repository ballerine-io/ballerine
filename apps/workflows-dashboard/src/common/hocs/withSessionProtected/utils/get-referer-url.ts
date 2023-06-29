export function getRefererUrl(): string | null {
  return localStorage.getItem('_ref') || null;
}
