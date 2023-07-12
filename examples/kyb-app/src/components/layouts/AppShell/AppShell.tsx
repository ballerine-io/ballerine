interface Props {
  children: React.ReactNode | React.ReactNode[];
}

export const AppShell = ({ children }: Props) => {
  return (
    <div className="grid h-full w-full grid-cols-10 gap-4">
      <div className="bg-primary col-span-2">123</div>
      <div className="col-span-8">{children}</div>
    </div>
  );
};
