interface Props {
  title?: string;
  description?: string | React.ReactNode;
  actionButton?: React.ReactNode;
}

export const AppErrorScreen = ({ title, description, actionButton }: Props) => {
  return (
    <div className="flex h-screen w-full flex-col gap-4 p-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      <div>{description}</div>
      {actionButton ? <div className="flex ">{actionButton}</div> : null}
    </div>
  );
};
