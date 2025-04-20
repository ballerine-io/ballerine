import { ctw } from '@/common/utils/ctw/ctw';

interface ITitleProps {
  className?: string;
  title?: string;
  text: string;
}

export const Title = ({ text, className, title }: ITitleProps) => {
  return (
    <p className={ctw('whitespace-nowrap no-underline', className)} title={title}>
      {text}
    </p>
  );
};
