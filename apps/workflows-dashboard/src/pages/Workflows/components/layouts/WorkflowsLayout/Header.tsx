interface Props {
  children: React.ReactNode;
}

export const Header = ({ children }: Props) => {
  return <header className="flex flex-col gap-4 p-4">{children}</header>;
};
