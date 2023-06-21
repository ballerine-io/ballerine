interface Props {
  children: React.ReactNode;
}

export const Footer = ({ children }: Props) => {
  return <footer className="flex justify-center p-4">{children}</footer>;
};
