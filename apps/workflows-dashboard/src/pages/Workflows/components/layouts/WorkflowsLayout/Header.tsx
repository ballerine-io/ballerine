interface Props {
  children: React.ReactNode;
}

export const Header = ({ children }: Props) => {
  return <div className="flex flex-col gap-4">{children}</div>;
};
