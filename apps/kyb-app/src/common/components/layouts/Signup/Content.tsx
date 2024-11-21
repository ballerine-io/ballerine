import { FunctionComponent } from 'react';

interface IContentProps {
  children: React.ReactNode;
}

export const Content: FunctionComponent<IContentProps> = ({ children }) => {
  return <div className="flex flex-1 flex-col py-[120px] pl-[100px]">{children}</div>;
};
