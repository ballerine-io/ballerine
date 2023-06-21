interface Props {
  children: React.ReactNode;
}

export const Header = ({ children }: Props) => {
  return <header className="p-4">{children}</header>;
};
