export interface Issue {
  name: string;
  reason?: string | null;
  properties?: Record<string, Issue>;
}
