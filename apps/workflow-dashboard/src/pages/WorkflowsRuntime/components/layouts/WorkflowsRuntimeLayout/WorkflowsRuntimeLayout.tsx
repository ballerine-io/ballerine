import './WorkflowsRuntimeLayout.module.css';
import { Header } from '@app/pages/WorkflowsRuntime/components/layouts/WorkflowsRuntimeLayout/Header';
import { Main } from '@app/pages/WorkflowsRuntime/components/layouts/WorkflowsRuntimeLayout/Main';
import { Footer } from '@app/pages/WorkflowsRuntime/components/layouts/WorkflowsRuntimeLayout/Footer';

interface Props {
  children: React.ReactNode[];
}

export function WorkflowsRuntimeLayout({ children }: Props) {
  return <div className="flex max-h-screen min-h-screen flex-col">{children}</div>;
}

WorkflowsRuntimeLayout.Header = Header;
WorkflowsRuntimeLayout.Main = Main;
WorkflowsRuntimeLayout.Footer = Footer;
