interface Props {
  title?: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export const AppErrorScreen = ({ title, subtitle, actionButton }: Props) => {
  return (
    <div className="flex h-screen w-full flex-col gap-4 p-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      <h2 className="text-muted-foreground opacity-50">{subtitle}</h2>
      {actionButton ? <div className="flex ">{actionButton}</div> : null}
    </div>
  );
};
