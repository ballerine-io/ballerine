export const hasPersistResponseDestination = (
  obj: any,
): obj is Record<string, unknown> & {
  persistResponseDestination: string;
} => 'persistResponseDestination' in obj && typeof obj.persistResponseDestination === 'string';
