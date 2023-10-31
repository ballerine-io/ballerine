export function getTraceId(span: any): string | undefined {
  if (!span) {
    // TODO: Should log a warning?
    return;
  }

  return span.spanContext().traceId;
}
