import { Footer } from './Footer';
import { Header } from './Header';
import { Main } from './Main';

interface Props {
  children: React.ReactNode[] | React.ReactNode;
}

export function WorkflowsLayout({ children }: Props) {
  return <div className="flex h-full flex-col gap-4">{children}</div>;
}

WorkflowsLayout.Header = Header;
WorkflowsLayout.Main = Main;
WorkflowsLayout.Footer = Footer;
