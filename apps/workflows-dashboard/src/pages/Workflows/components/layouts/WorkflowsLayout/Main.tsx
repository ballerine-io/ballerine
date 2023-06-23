interface Props {
  children: React.ReactNode;
}

export const Main = ({ children }: Props) => {
  return <main className="flex flex-1 overflow-auto pl-4 pr-4">{children}</main>;
};
