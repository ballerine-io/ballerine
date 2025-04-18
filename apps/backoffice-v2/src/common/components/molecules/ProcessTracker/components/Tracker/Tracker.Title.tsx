import { ctw } from '@/common/utils/ctw/ctw';

interface ITitleProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Title = ({ children, className, title }: ITitleProps) => {
  return (
    <div className={ctw('whitespace-nowrap no-underline', className)} title={title}>
      {children}
    </div>
  );
};
