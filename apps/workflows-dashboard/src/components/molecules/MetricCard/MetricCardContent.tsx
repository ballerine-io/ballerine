interface Props {
  children: React.ReactNode;
}

export function MetricCardContent({ children }: Props) {
  return <div className="h-full">{children}</div>;
}

MetricCardContent.displayName = 'MetricCardContent';
